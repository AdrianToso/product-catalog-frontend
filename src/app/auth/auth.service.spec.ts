import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}Auth`;

  // Crear un token JWT de prueba con payload decodificable
  // Payload: { "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "admin", "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin", ... }
  const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTczNTY4OTY2MSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE3NSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjQyMDAifQ.fakeSignature';

  beforeAll(() => {
    // Polyfill para atob en el entorno de prueba de Node.js (Karma)
    if (typeof window.atob === 'undefined') {
      window.atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    service.isLoggedInSig.set(false);
    service.roleSig.set(null);
    service.userSig.set(null);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should perform a POST request and store user data on successful login', () => {
      const mockResponse = {
        token: fakeJwt,
        expiresAt: new Date().toISOString()
      };

      service.login('admin', 'password').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('role')).toBe('Admin');
      expect(localStorage.getItem('userName')).toBe('admin');
      
      expect(service.isLoggedInSig()).toBe(true);
      expect(service.roleSig()).toBe('Admin');
      expect(service.userSig()).toBe('admin');
    });

    it('should clear user data and return an error on failed login', () => {
      const errorResponse = { status: 400, statusText: 'Bad Request' };

      service.login('wrong', 'user').subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
          expect(err.message).toBe('Usuario o contraseña incorrectos.');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush('Invalid credentials', errorResponse);

      expect(localStorage.getItem('token')).toBeNull();
      expect(service.isLoggedInSig()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear all authentication data from localStorage and signals', () => {
      localStorage.setItem('token', 'some-token');
      localStorage.setItem('role', 'Admin');
      localStorage.setItem('userName', 'testuser');
      service.isLoggedInSig.set(true);

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
      expect(localStorage.getItem('userName')).toBeNull();
      expect(service.isLoggedInSig()).toBe(false);
      expect(service.roleSig()).toBeNull();
      expect(service.userSig()).toBeNull();
    });
  });
});