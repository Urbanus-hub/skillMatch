// src/app/auth/login/login.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { catchError, tap, finalize, throwError, Subject, takeUntil } from 'rxjs';

// Interface for the expected API response structure
interface LoginApiResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      user_type: string;
      // Add other user properties if needed
      [key: string]: any; // Allow other properties
    };
    // Add other data properties if needed
    [key: string]: any; // Allow other properties
  };
  message?: string; // Optional message property
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  hidePassword = true;

  // Use constructor injection
  private fb: FormBuilder;
  private router: Router;
  private http: HttpClient;

  // --- MODIFIED LINE: Hardcoded API Base URL ---
  // Replace 'YOUR_API_ENDPOINT_HERE' with your actual backend URL
  private readonly apiBaseUrl = 'http://localhost:3000/api';
  // Example: private readonly apiBaseUrl = 'http://localhost:5000/api';
  // Example: private readonly apiBaseUrl = 'https://your-production-api.com/api';
  // --- END MODIFICATION ---

  private destroy$ = new Subject<void>(); // For unsubscribing

  constructor(fb: FormBuilder, router: Router, http: HttpClient) {
    this.fb = fb;
    this.router = router;
    this.http = http;

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Automatic login logic removed
    console.log('LoginComponent initialized without automatic login check');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    console.log('LoginComponent destroyed, subscriptions cleaned up.');
  }

  /**
   * Previously used to check for existing session and auto-login.
   * Now just a utility method to clear session data if needed.
   */
  clearUserSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    console.log('Cleared user session data from local storage.');
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      console.warn('Login form is invalid. Please check the fields.');
      const firstInvalidControl = Object.keys(this.loginForm.controls).find(key => this.loginForm.controls[key].invalid);
      if (firstInvalidControl) {
        console.warn(`First invalid control: ${firstInvalidControl}`, this.loginForm.controls[firstInvalidControl].errors);
      }
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;

    console.log('Attempting login for:', credentials.email);

    // Construct the full URL for the login endpoint
    const loginUrl = `${this.apiBaseUrl}/auth/login`;
    console.log(`Sending login request to: ${loginUrl}`); // Log the full URL

    this.http.post<LoginApiResponse>(loginUrl, credentials)
      .pipe(
        tap(response => {
          console.log('Login HTTP request successful, processing response:', response);

          if (!response || !response.success || !response.data) {
             console.error('Invalid response structure or login unsuccessful:', response);
             throw new Error(response?.message || 'Login failed: Invalid response from server.');
          }

          const responseData = response.data;

          if (!responseData.token) {
            console.error('Response data missing token:', responseData);
            throw new Error('Authentication token not found in response data.');
          }
          if (!responseData.user) {
            console.error('Response data missing user data:', responseData);
            throw new Error('User data not found in response data.');
          }
          const userType = responseData.user.user_type;
          if (!userType) {
            console.error('Response user data missing user_type:', responseData.user);
            throw new Error('User type not found in response data.');
          }

          console.log('Storing auth token and user data in local storage.');
          localStorage.setItem('authToken', responseData.token);
          localStorage.setItem('currentUser', JSON.stringify(responseData.user));

          console.log(`Login successful, navigating with user type: ${userType}`);
          this.navigateToDashboard(userType);
        }),
        catchError((error: HttpErrorResponse | Error) => {
          console.error('Error during login HTTP request or processing:', error);

          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 || error.status === 400) {
              this.errorMessage = error.error?.message || 'Invalid email or password.';
            } else if (error.status === 0) {
               this.errorMessage = 'Could not connect to the server. Please check your network connection.';
            } else if (error.status >= 500) {
              this.errorMessage = 'A server error occurred. Please try again later.';
            } else {
              this.errorMessage = error.error?.message || `An unexpected error occurred (Status: ${error.status}).`;
            }
          } else {
             this.errorMessage = error.message || 'An unexpected error occurred while processing the login response.';
          }

          return throwError(() => new Error(this.errorMessage || 'Login failed due to an unknown error.'));
        }),
        finalize(() => {
          this.isLoading = false;
          console.log('Login request sequence finished (finalize).');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
            console.log('Login subscription received next notification (handled in tap).');
        },
        error: (err) => {
          console.error('Login subscription received final error:', err.message);
        },
        complete: () => {
            console.log('Login HTTP observable completed.');
        }
      });
  }

  navigateToDashboard(userType: string): void {
    const normalizedUserType = (typeof userType === 'string' ? userType : '').toLowerCase().trim();
    let destinationRoute: string;

    console.log(`Determining navigation route for user type: "${normalizedUserType}"`);

    switch (normalizedUserType) {
      case 'job_seeker':
        destinationRoute = '/seekerDashboard';
        break;
      case 'employer':
        destinationRoute = '/talentBoard';
        break;
      case 'admin':
        destinationRoute = '/admin/dashboard';
        break;
      default:
        console.warn(`Unknown or missing user type: "${userType}". Navigating to default fallback route.`);
        destinationRoute = '/dashboard';
        break;
    }

    console.log(`Attempting navigation to: ${destinationRoute}`);
    this.router.navigate([destinationRoute])
      .then(success => {
        if (success) {
            console.log(`Navigation to ${destinationRoute} successful.`);
        } else {
          console.error(`Navigation to ${destinationRoute} failed. Check Angular Router configuration.`);
          this.errorMessage = `Login successful, but couldn't navigate to your dashboard (Route: ${destinationRoute}). Please contact support.`;
        }
      })
      .catch(err => {
        console.error(`Error during navigation attempt to ${destinationRoute}:`, err);
        this.errorMessage = `Login successful, but an error occurred during navigation: ${err.message}`;
      });
  }

  signInWithGoogle(): void {
    console.log('Google Sign-In button clicked - implementation pending.');
    this.errorMessage = 'Google Sign-In is not yet implemented.';
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}