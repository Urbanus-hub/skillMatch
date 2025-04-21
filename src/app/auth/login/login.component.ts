// login.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { catchError, tap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, // For formGroup, formControlName
    CommonModule,      // For *ngIf, ngClass
    RouterLink,        // For routerLink directive (e.g., to registration)
    HttpClientModule   // Provides HttpClient
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Make sure you have this CSS file
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false; // Controls button state and loading text
  errorMessage: string | null = null; // Holds API error messages for display
  hidePassword = true; // Controls password field visibility

  // Inject services using inject function
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  // API Base URL (Consider moving to environment config)
  private apiBaseUrl = 'http://localhost:5000/api'; // Adjust if your backend URL is different

  constructor() {
    // Initialize the form group
    this.loginForm = this.fb.group({
      // Define form controls with validators
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
      // 'rememberMe' is not included as it was removed from the HTML
    });
  }

  ngOnInit(): void {
    // Optional: You could add logic here to check if the user is already
    // logged in (e.g., by checking localStorage or an AuthService) and
    // redirect them immediately.
    // Example:
    // const token = localStorage.getItem('authToken');
    // const userString = localStorage.getItem('currentUser');
    // if (token && userString) {
    //   try {
    //     const user = JSON.parse(userString);
    //     if (user && user.user_type) {
    //        console.log('User already logged in, redirecting...');
    //        this.navigateToDashboard(user.user_type);
    //     }
    //   } catch (e) {
    //     console.error('Error parsing stored user data', e);
    //     localStorage.removeItem('authToken'); // Clear invalid data
    //     localStorage.removeItem('currentUser');
    //   }
    // }
  }

  // Handles the form submission
  onSubmit(): void {
    this.errorMessage = null; // Clear previous errors on a new submission attempt
    this.loginForm.markAllAsTouched(); // Mark fields as touched to show validation errors

    // Stop if the form is invalid
    if (this.loginForm.invalid) {
      console.log('Login form is invalid');
      // Optionally find and log the first invalid control
      for (const key of Object.keys(this.loginForm.controls)) {
        if (this.loginForm.controls[key].invalid) {
          console.log(`Invalid control: ${key}`, this.loginForm.controls[key].errors);
          break;
        }
      }
      return;
    }

    this.isLoading = true; // Set loading state for UI feedback
    const credentials = this.loginForm.value; // Get email and password from the form

    console.log('Attempting login for:', credentials.email);

    // Make the POST request to the backend login endpoint
    this.http.post<any>(`${this.apiBaseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // --- Success Handling ---
          console.log('Login successful:', response);
          // Ensure the response contains the expected token and user info
          if (response && response.token && response.user && response.user.user_type) {
            // Store token and user data (Consider using AuthService for better practice)
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));

            // Navigate based on the user type received from the backend
            this.navigateToDashboard(response.user.user_type);
          } else {
            // Handle unexpected successful response format
            console.error('Login response missing token, user data, or user_type.');
            this.errorMessage = 'Login failed: Invalid response from server.';
            // Clear potentially partial stored data
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          // --- Error Handling ---
          console.error('Login HTTP error:', error);
          // Provide user-friendly error messages based on status code
          if (error.status === 401 || error.status === 400) { // Unauthorized or Bad Request (often used for invalid creds)
            this.errorMessage = error.error?.message || 'Invalid email or password.';
          } else if (error.status === 0 || error.status >= 500) { // Network error or server-side issue
            this.errorMessage = 'Could not connect to the server or server error occurred. Please try again later.';
          } else { // Other client-side errors or unexpected statuses
            this.errorMessage = error.error?.message || `An unexpected error occurred (Status: ${error.status}). Please try again.`;
          }
          // Rethrow the error to be caught by the subscription's error handler if needed,
          // or just signal that an error occurred.
          return throwError(() => new Error(this.errorMessage || 'Login failed'));
        }),
        finalize(() => {
          // --- Cleanup ---
          // This block executes regardless of success or error
          this.isLoading = false; // Ensure loading indicator is turned off
          console.log('Login request finished.');
        })
      )
      .subscribe({
        // next: Handled by the 'tap' operator above
        error: (err) => {
          // Error is already processed by 'catchError' and 'finalize'.
          // You could potentially add specific UI updates here if needed,
          // but usually setting isLoading=false and errorMessage is sufficient.
          console.log('Login subscription received error:', err.message);
        }
        // complete: Can be added if you need to do something specifically on completion *after* success
      });
  }

  // Navigates the user to the appropriate dashboard based on their type
  navigateToDashboard(userType: string): void {
    console.log(`Navigating based on user type: ${userType}`);
    let destinationRoute: string;

    switch (userType) {
      case 'job_seeker': // Ensure this matches the value from your backend
        destinationRoute = '/seekerDashboard'; // Example route
        break;
      case 'employer':   // Ensure this matches the value from your backend
        destinationRoute = '/talentBoard'; // Example route
        break;
      case 'admin':      // Ensure this matches the value from your backend
        destinationRoute = '/admin/dashboard';   // Example route
        break;
      default:
        console.warn(`Unknown user type received: "${userType}". Navigating to default dashboard.`);
        destinationRoute = '/dashboard'; // Define a sensible fallback route
        break;
    }
    this.router.navigate([destinationRoute]);
  }

  // Placeholder for Google Sign-In functionality
  signInWithGoogle(): void {
    console.log('Google Sign-In button clicked - implementation pending.');
    // Set an error message or feedback for the user
    this.errorMessage = 'Google Sign-In is not yet implemented.';
    // Add actual Google Sign-In library calls and backend integration here
  }

  // Note: The password toggle is handled directly in the template via:
  // (click)="hidePassword = !hidePassword"
  // So, no specific toggle method is strictly required here unless you prefer one.
}
