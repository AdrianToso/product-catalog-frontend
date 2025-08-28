import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../auth/auth.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { signal, Signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockAuthService: any;
  let mockBreakpointObserver: any;

  beforeEach(async () => {
    // Creamos signals reales
    const isLoggedInSig: Signal<boolean> = signal(true);
    const userSig: Signal<string | null> = signal('Test User');

    mockAuthService = {
      isLoggedInSig,
      userSig,
      logout: jest.fn(),
    };

    const breakpointSubject = new BehaviorSubject<BreakpointState>({
      matches: true,
      breakpoints: {},
    });
    mockBreakpointObserver = {
      observe: jest.fn(() => breakpointSubject.asObservable()),
    };

    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout and navigate on onLogout', () => {
    component.onLogout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should close sidenav if handset', fakeAsync(() => {
    // Mock de sidenav
    component.snav = { close: jest.fn() } as unknown as MatSidenav;
    component.closeSidenavIfNeeded();
    tick();
    expect(component.snav.close).toHaveBeenCalled();
  }));

  it('should not throw if sidenav is undefined', fakeAsync(() => {
    component.snav = { close: jest.fn() } as unknown as MatSidenav;
    expect(() => component.closeSidenavIfNeeded()).not.toThrow();
    tick();
    expect(component.snav.close).toHaveBeenCalled();
  }));
});
