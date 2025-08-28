import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

// Mocks
class MockAuthService {
  getToken(): string | null { return 'test-token'; }
  logout = jest.fn();
}

class MockRouter {
  navigate = jest.fn();
}

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should add Authorization header when token is present', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    const authHeader = req.request.headers.get('Authorization');
    expect(authHeader).not.toBeNull();
    expect(authHeader).toBe('Bearer test-token');
    req.flush({}); // responder request
  });

  it('should not add Authorization header when token is absent', () => {
    jest.spyOn(authService, 'getToken').mockReturnValue(null);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should logout and redirect on 401 error', () => {
    httpClient.get('/test').subscribe({
      error: () => {} // evitar error en subscribe
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should throw error for non-401 errors', () => {
    let caughtError: any;
    httpClient.get('/test').subscribe({
      error: (err) => caughtError = err
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(caughtError.status).toBe(500);
    expect(authService.logout).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
