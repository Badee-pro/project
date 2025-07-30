/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  // Component properties
  email = '';
  password = '';
  errorMessage = '';
  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private http: HttpClient, private router: Router) {}

  // Method to handle form submission
  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    // Validate email format
    const userCredentials = {
      email: this.email.toLowerCase(),
      password: this.password,
    };

    // Send the user credentials to the backend for authentication
    this.http
      .post(`${environment.apiBaseUrl}/signin`, userCredentials)
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.accessToken);
          this.router.navigate(['/badee-project-frontend/profile/index.html']);
        },
        // Handle error response
        (error) => {
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Authentication failed. Please try again.';
          }
          console.error('Sign-in failed', error);
        }
      );
  }
}
