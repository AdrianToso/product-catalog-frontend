import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    // Logs de depuración
    console.log('AuthInterceptor: Token presente', !!token);
    console.log('AuthInterceptor: URL de la solicitud', request.url);

    if (token) {
      // Clonar la request y agregar el header de autorización
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('AuthInterceptor: Header Authorization agregado');
    } else {
      console.warn('AuthInterceptor: No se encontró token, request sin autenticación');
    }

    return next.handle(request).pipe(
      // Tap para ver la respuesta exitosa
      tap(event => {
        console.log('AuthInterceptor: Solicitud exitosa', event);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('AuthInterceptor: Error en la solicitud', error);
        if (error.status === 401) {
          console.log('AuthInterceptor: Error 401, cerrando sesión');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}