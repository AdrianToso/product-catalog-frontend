import { Component, Signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  @ViewChild('snav') snav!: MatSidenav;

  isHandset$: Observable<boolean>;
  isLoggedIn: Signal<boolean>;
  userName: Signal<string | null>;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
      
    this.isLoggedIn = this.authService.isLoggedInSig;
    this.userName = this.authService.userSig;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  closeSidenavIfNeeded(): void {
    this.isHandset$.pipe(take(1)).subscribe(isHandset => {
      if (isHandset) {
        this.snav.close();
      }
    });
  }
}