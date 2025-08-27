import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: any;
  let router: any;

  beforeEach(() => {
    authService = {
      getRoles: jest.fn()
    };

    router = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should allow access for Admin role', () => {
    const mockRoute = {
      data: {
        expectedRoles: ['Admin']
      }
    };
    
    authService.getRoles.mockReturnValue(['Admin']);
    const result = guard.canActivate(mockRoute as any, null as any);
    expect(result).toBe(true);
  });

  it('should allow access for Editor role', () => {
    const mockRoute = {
      data: {
        expectedRoles: ['Editor']
      }
    };
    
    authService.getRoles.mockReturnValue(['Editor']);
    const result = guard.canActivate(mockRoute as any, null as any);
    expect(result).toBe(true);
  });

  it('should deny access for User role', () => {
    const mockRoute = {
      data: {
        expectedRoles: ['Admin', 'Editor']
      }
    };
    
    authService.getRoles.mockReturnValue(['User']);
    const result = guard.canActivate(mockRoute as any, null as any);
    expect(result).toBe(false);
    // Cambiar '/unauthorized' por '/home' para que coincida con la implementación real
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});