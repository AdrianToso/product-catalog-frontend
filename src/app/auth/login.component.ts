import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
  }
}