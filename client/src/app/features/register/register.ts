import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RegisterDto } from '../../core/models/registerDto';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  firstname = '';
  lastname = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage: string | null = null;
  successMessage: string | null = null;

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const dto: RegisterDto = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.authService.register(dto).subscribe({
      next: res => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        if (err.status === 400 && err.error?.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Registration failed. Please try again later.';
        }
      },
    });
  }
}
