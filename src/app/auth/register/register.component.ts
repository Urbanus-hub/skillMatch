// register.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { catchError, tap, finalize } from 'rxjs/operators'; // Import finalize
import { throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  // Ensure all necessary modules for the template are imported here for standalone
  imports: [
    ReactiveFormsModule, // For formGroup, formControlName
    CommonModule,      // For *ngIf, *ngFor, ngClass, etc.
    RouterLink,        // For routerLink directive
    HttpClientModule   // Provides HttpClient if not provided elsewhere (e.g., appConfig)
  ],
  standalone: true
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  userType: string | null = null;
  errorMessage: string | null = null; // Renamed from registrationError to match HTML
  isLoading = false;

  // Inject services using inject function
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient); // Use inject for consistency

  // API Base URL (Consider moving to environment config)
  private apiBaseUrl = 'http://localhost:5000/api';

  constructor() { // Constructor can be simplified if only using inject
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.userType = params.get('userType');
      console.log('User Type from query params:', this.userType);
      if (!this.userType || !['job_seeker', 'employer'].includes(this.userType)) {
         console.error('Invalid or missing userType query parameter.');
         // Use the renamed property
         this.errorMessage = 'Invalid registration link. Please select your role again.';
         // Optionally disable the form or redirect
         this.registerForm.disable(); // Example: disable form if type is invalid
         // this.router.navigate(['/auth-selection']);
      } else {
        // Ensure form is enabled if type is valid (in case it was disabled before)
        this.registerForm.enable();
      }
    });
  }

  // Static method or move outside component if it doesn't rely on 'this'
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    // Only compare if both fields have values to avoid premature errors
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // If the control exists and has the mismatch error, clear it
      // Check if other errors exist before setting to null
      const errors = form.get('confirmPassword')?.errors;
      if (errors && errors['passwordMismatch']) {
        delete errors['passwordMismatch']; // Remove only the mismatch error
        if (Object.keys(errors).length === 0) {
          form.get('confirmPassword')?.setErrors(null); // Set to null if no other errors
        } else {
          form.get('confirmPassword')?.setErrors(errors); // Keep other errors
        }
      }
    }
    return null;
  }

  onSubmit(): void {
    this.errorMessage = null; // Clear previous errors using the renamed property
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      // Find the first invalid control for better debugging/UX
      for (const key of Object.keys(this.registerForm.controls)) {
        if (this.registerForm.controls[key].invalid) {
          console.log(`Invalid control: ${key}`, this.registerForm.controls[key].errors);
          // Optionally focus the first invalid element
          // const invalidControl = document.querySelector(`[formControlName="${key}"]`);
          // (invalidControl as HTMLElement)?.focus();
          break;
        }
      }
      return;
    }

    if (!this.userType) {
        // Use the renamed property
        this.errorMessage = 'Cannot register without a valid user type. Please go back and select your role.';
        console.error('User type is missing during submit.');
        return;
    }

    this.isLoading = true;

    const { firstName, lastName, email, password } = this.registerForm.value;
    const registrationData = {
      first_name: firstName, // Match backend expectation (snake_case)
      last_name: lastName,   // Match backend expectation (snake_case)
      email: email,
      password: password,
      user_type: this.userType
    };

    console.log('Submitting registration data:', registrationData);

    this.http.post<any>(`${this.apiBaseUrl}/auth/register`, registrationData)
      .pipe(
        tap(response => {
          console.log('Registration successful:', response);
          // Consider moving token/user storage to an AuthService
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          // Navigate after success
          // Maybe show a success message before navigating
          alert('Registration successful! Redirecting...'); // Replace with a better notification
          this.router.navigate(['/auth/login']); // Adjust as needed
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Registration error:', error);
          if (error.error && typeof error.error === 'object' && error.error.message) {
             // Use the renamed property
            this.errorMessage = error.error.message; // Prefer specific backend message
          } else if (error.status === 0 || error.status === 503) { // Network error or service unavailable
             // Use the renamed property
            this.errorMessage = 'Could not connect to the server. Please check your connection or try again later.';
          } else if (error.status === 409) { // Conflict (e.g., email already exists)
             // Use the renamed property
            this.errorMessage = error.error?.message || 'This email address is already registered.';
          }
           else {
             // Use the renamed property for generic errors
            this.errorMessage = `An unexpected error occurred (Status: ${error.status}). Please try again.`;
          }
          return throwError(() => new Error(this.errorMessage || 'An unknown error occurred')); // Rethrow a new error or the original
        }),
        finalize(() => {
          // This block executes whether the request succeeds or fails
          this.isLoading = false; // Ensure loading state is turned off
          console.log('Registration request finished.');
        })
      )
      .subscribe({
        // next: handled by tap
        // error: handled by catchError
        // complete: can be added if needed, finalize often covers the cleanup
      });
  }

  signInWithGoogle(): void {
    console.log('Continue with Google account clicked - implement logic');
    this.errorMessage = 'Google Sign-In is not yet implemented.'; // Provide feedback
    // Actual Google Sign-In logic would go here
  }

  // Method to toggle password visibility (referenced in HTML via property binding)
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  // goToSignIn method is not strictly needed if only using RouterLink in HTML
  // but can be kept if called programmatically elsewhere.
  // goToSignIn(): void {
  //   console.log('Navigate to Sign in');
  //   this.router.navigate(['/auth/login']);
  // }
}
