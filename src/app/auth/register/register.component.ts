// register.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { catchError, tap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Interface for backend validation errors
interface ValidationError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    HttpClientModule
  ],
  standalone: true
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  userType: string | null = null;
  errorMessage: string | null = null; // General error message for display
  errorMessages: string[] = []; // Holds formatted validation errors for display
  isLoading = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  private apiBaseUrl = 'http://localhost:3000/api';

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.userType = params.get('userType');
      console.log('User Type from query params:', this.userType);
      if (!this.userType || !['job_seeker', 'employer'].includes(this.userType)) {
         console.error('Invalid or missing userType query parameter.');
         this.errorMessage = 'Invalid registration link. Please select your role again.';
         this.registerForm.disable(); // Disable form if userType is invalid
      } else {
        this.registerForm.enable(); // Ensure form is enabled if userType is valid
      }
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Don't validate if controls haven't been touched or values are missing
    if (!password || !confirmPassword) {
      return null;
    }

    // Set error on confirmPassword control if they don't match
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true }; // Return error for the FormGroup
    } else {
      // Clear the specific error if they match now
      const errors = control.get('confirmPassword')?.errors;
      if (errors && errors['passwordMismatch']) {
        delete errors['passwordMismatch'];
        // Set errors to null only if no other errors exist on the control
        if (Object.keys(errors).length === 0) {
          control.get('confirmPassword')?.setErrors(null);
        } else {
          control.get('confirmPassword')?.setErrors(errors);
        }
      }
      return null; // Passwords match, return null for the FormGroup
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.errorMessages = []; // Clear previous errors
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      // Log specific errors for debugging
      Object.keys(this.registerForm.controls).forEach(key => {
        const controlErrors = this.registerForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`Control '${key}' errors:`, controlErrors);
        }
      });
      // Check for form-level errors (like password mismatch)
      if (this.registerForm.errors) {
         console.log('FormGroup errors:', this.registerForm.errors);
      }
      this.errorMessage = "Please correct the errors highlighted below."; // User-friendly message
      return;
    }

    if (!this.userType) {
        this.errorMessage = 'Cannot register without a valid user type. Please go back and select your role.';
        console.error('User type is missing during submit.');
        return;
    }

    this.isLoading = true;

    const { firstName, lastName, email, password } = this.registerForm.value;
    // Ensure data matches backend expectations (snake_case)
    const registrationData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      confirm_password: this.registerForm.value.confirmPassword, // Include confirm_password for backend validation
      user_type: this.userType
    };

    console.log('Submitting registration data:', registrationData);

    this.http.post<any>(`${this.apiBaseUrl}/auth/register`, registrationData)
      .pipe(
        tap(response => {
          console.log('Registration successful:', response);
          // Ensure response structure is as expected before accessing properties
          if (response && response.data && response.data.token && response.data.user) {
              
              
              // Remove the blocking alert and just navigate directly to login
              this.router.navigate(['/auth/login']);
          } else {
              console.error('Unexpected success response structure:', response);
              this.errorMessage = 'Registration succeeded but received unexpected data.';
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Registration error response:', error); // Log the full error
          this.errorMessages = []; // Reset detailed errors

          // Check for backend validation errors first (most specific)
          if (error.error && Array.isArray(error.error.errors)) {
            // Assuming errors are { field: string, message: string }
            this.errorMessages = error.error.errors.map((e: ValidationError) => `${e.field}: ${e.message}`);
            this.errorMessage = 'Please correct the errors below.'; // General message when multiple validation errors exist
          }
          // Check for single error message object { message: '...' } or { error: '...' }
          else if (error.error && typeof error.error === 'object' && (error.error.message || error.error.error)) {
            this.errorMessage = error.error.message || error.error.error;
            if (this.errorMessage) {
              this.errorMessages.push(this.errorMessage); // Add to array as well
            }
          }
          // Check for plain string error response body
          else if (typeof error.error === 'string') {
             this.errorMessage = error.error;
             this.errorMessages.push(this.errorMessage);
          }
          // Network/Server Down errors
          else if (error.status === 0 || error.status === 503) {
            this.errorMessage = 'Could not connect to the server. Please check your connection or try again later.';
            this.errorMessages.push(this.errorMessage);
          }
          // Conflict (e.g., email exists)
          else if (error.status === 409) { // Use 409 for Conflict
            this.errorMessage = error.error?.message || error.error?.error || 'This email address is already registered.';
            this.errorMessages.push(this.errorMessage ?? 'Unknown error occurred.'); // Provide a default string
          }
          // Other HTTP errors (including 400 if not caught above)
          else {
            this.errorMessage = `An unexpected error occurred (Status: ${error.status}). Please try again.`;
            this.errorMessages.push(this.errorMessage);
          }

          // Ensure errorMessage is set if errorMessages has content but errorMessage wasn't specifically set
          if (this.errorMessages.length > 0 && this.errorMessage === 'Please correct the errors below.' && this.errorMessages.length === 1) {
              this.errorMessage = this.errorMessages[0]; // If only one validation error, show it directly
          } else if (this.errorMessages.length === 0 && !this.errorMessage) {
              this.errorMessage = 'An unknown registration error occurred.'; // Fallback
              this.errorMessages.push(this.errorMessage);
          }

          return throwError(() => new Error(this.errorMessage || 'An unknown error occurred'));
        }),
        finalize(() => {
          this.isLoading = false;
          console.log('Registration request finished.');
        })
      )
      .subscribe({
        // next and error are handled by tap and catchError
      });
  }

  signInWithGoogle(): void {
    console.log('Continue with Google account clicked - implement logic');
    this.errorMessage = 'Google Sign-In is not yet implemented.';
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }
}