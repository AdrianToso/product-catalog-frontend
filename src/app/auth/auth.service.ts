import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, catchError, throwError } from 'rxjs';

interface AuthResponse {
  token: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}Auth`;
  
  isLoggedInSig = signal<boolean>(this.hasValidToken());
  roleSig = signal<string[] | null>(this.getRoles());
  userSig = signal<string | null>(this.getUsername());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          const decoded = this.decodeToken(res.token);
          
          if (decoded) {
            localStorage.setItem('roles', JSON.stringify(decoded.roles));
            localStorage.setItem('userName', decoded.unique_name);
            this.isLoggedInSig.set(true);
            this.roleSig.set(decoded.roles);
            this.userSig.set(decoded.unique_name);
          }
        }),
        catchError(_err => {
            this.logout();
            return throwError(() => new Error('Usuario o contraseña incorrectos.'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('userName');
    this.isLoggedInSig.set(false);
    this.roleSig.set(null);
    this.userSig.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  hasToken(): boolean {
    return !!this.getToken();
  }

  hasValidToken(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }

  getRoles(): string[] | null {
    const rolesStr = localStorage.getItem('roles');
    return rolesStr ? JSON.parse(rolesStr) : null;
  }
  
  getUsername(): string | null {
    return localStorage.getItem('userName');
  }

  isAdmin(): boolean {
    const roles = this.getRoles();
    return roles ? roles.includes('Admin') : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.roleSig();
    return userRoles ? roles.some(role => userRoles.includes(role)) : false;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsed = JSON.parse(decodedPayload);
      
      // Verificar si el token tiene fecha de expiración
      if (parsed.exp) {
        const expiration = parsed.exp * 1000; // Convertir a milisegundos
        return Date.now() >= expiration;
      }
      
      // Si no tiene exp, verificar si tiene expiresAt
      if (parsed.expiresAt) {
        const expiration = new Date(parsed.expiresAt).getTime();
        return Date.now() >= expiration;
      }
      
      // Si no tiene información de expiración, asumimos que está expirado
      return true;
    } catch (e) {
      console.error('Error verificando expiración del token', e);
      return true;
    }
  }

  private decodeToken(token: string): { roles: string[]; unique_name: string } | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsed = JSON.parse(decodedPayload);
      
      let roles: string[] = [];
      const roleClaim = parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      if (Array.isArray(roleClaim)) {
        roles = roleClaim;
      } else if (typeof roleClaim === 'string') {
        roles = [roleClaim];
      }
      
      return {
        roles: roles,
        unique_name: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      };
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
}