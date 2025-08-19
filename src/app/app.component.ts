import { Component, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  isLoggedIn: WritableSignal<boolean>;
  
  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedInSig;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}