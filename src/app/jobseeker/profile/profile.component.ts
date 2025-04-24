// src/app/jobseeker/profile/profile.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, finalize, tap, throwError, of } from 'rxjs';

// Define interfaces for better type safety
interface UserProfileResponse {
  id: number; // Or string
  user_id: number; // Or string
  job_title: string | null;
  location: string | null;
  professional_summary: string | null;
  years_of_experience: number | null;
  experience_level: string | null;
  primary_industry: string | null;
  // Add other fields returned by the backend
}

// Interface for the data sent TO the backend
interface UserProfilePayload {
  jobTitle: string | null;
  experience: string | null; // Corresponds to experience_level
  industry: string | null; // Corresponds to primary_industry
  location: string | null;
  summary: string | null; // Corresponds to professional_summary
  // Add years_of_experience if collected
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentStep = 1;
  basicInfoForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  authToken: string | null = null;

  // TODO: Fetch these from backend API endpoints for dynamic options
  experienceLevels = ['Entry-level', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
  industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Other'];

  // Inject services
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // Use hardcoded API URL
  private apiUrl = 'http://localhost:3000/api';

  constructor() {
    this.basicInfoForm = this.fb.group({
      jobTitle: [''],
      experience: ['', Validators.required], // Maps to experience_level
      industry: ['', Validators.required], // Maps to primary_industry
      location: [''],
      summary: [''] // Maps to professional_summary
    });
    
    // Try to get the authentication token from multiple sources
    this.getAuthToken();
  }

  /**
   * Attempts to retrieve the auth token from various storage locations
   */
  private getAuthToken(): void {
    // Try localStorage first
    let token = localStorage.getItem('auth_token');
    
    // If not in localStorage, try sessionStorage
    if (!token) {
      token = sessionStorage.getItem('auth_token');
    }
    
    // If still not found, check for common alternative token keys
    if (!token) {
      const alternatives = [
        'token', 'accessToken', 'access_token', 'jwt', 'id_token',
        'user_token', 'bearerToken', 'authToken'
      ];
      
      for (const key of alternatives) {
        token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) break;
      }
    }
    
    // If we found a token, store it
    if (token) {
      this.authToken = token;
      console.log('Auth token found');
    } else {
      console.warn('No auth token found in storage');
    }
  }

  ngOnInit(): void {
    // Try to load profile data even if we don't have a token yet
    // The loadProfileData will handle authentication errors
    this.loadProfileData();
  }

  /**
   * Creates HTTP headers with authorization token if available
   */
  private getAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Only add Authorization header if token exists
    if (this.authToken) {
      return headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    
    return headers;
  }

  /**
   * Handles authentication errors by redirecting to login
   */
  private handleAuthError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      console.error('Authentication error:', error);
      this.errorMessage = 'Please log in to continue. Redirecting to login...';
      
      // Clear any stored auth data
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        this.router.navigate(['/auth/login'], { 
          queryParams: { returnUrl: this.router.url }  // Store current URL to return after login
        });
      }, 2000);
    }
    return throwError(() => error);
  }

  /**
   * Fetches existing profile data to pre-fill the form.
   */
  loadProfileData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Use the defined interface for the response type
    this.http.get<UserProfileResponse>(`${this.apiUrl}/user-profiles/me`, {
      headers: this.getAuthHeaders()
    })
    .pipe(
        finalize(() => this.isLoading = false),
        catchError((err: HttpErrorResponse) => {
          // Handle 401/403 authentication errors separately
          if (err.status === 401 || err.status === 403) {
            return this.handleAuthError(err);
          }
          
          // Handle cases where profile might not exist yet (e.g., 404)
          if (err.status !== 404) {
              console.error('Failed to load profile data', err);
              this.errorMessage = err.error?.message || 'Could not load profile data.';
          } else {
              console.log('No existing profile found, starting fresh.');
              // No error message needed if profile just doesn't exist yet
          }
          // Return an empty observable to continue
          return of(null);
        })
    )
    .subscribe({
      next: (data) => {
        if (data) {
          // Map backend field names (snake_case) to form control names (camelCase)
          const formData = {
            jobTitle: data.job_title,
            experience: data.experience_level,
            industry: data.primary_industry,
            location: data.location,
            summary: data.professional_summary
          };
          this.basicInfoForm.patchValue(formData);
          console.log('Profile data loaded successfully');
        }
      }
    });
  }

  /**
   * Handles form submission for the basic info step.
   * Only proceeds to next step/page after successful data submission.
   */
  continue(): void {
    this.errorMessage = null;
    this.basicInfoForm.markAllAsTouched();

    if (this.basicInfoForm.invalid) {
      console.log('Basic Info form is invalid');
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

   

    this.isLoading = true;
    // Prepare payload matching backend expectations
    const payload: UserProfilePayload = {
      jobTitle: this.basicInfoForm.value.jobTitle || null,
      experience: this.basicInfoForm.value.experience || null,
      industry: this.basicInfoForm.value.industry || null,
      location: this.basicInfoForm.value.location || null,
      summary: this.basicInfoForm.value.summary || null
    };

    console.log('Submitting profile data:', payload);

    // Use the defined interface for the response type with auth headers
    this.http.put<UserProfileResponse>(`${this.apiUrl}/users/profile`, payload, {
      headers: this.getAuthHeaders()
    })
    .pipe(
      tap(response => {
        console.log('Profile updated successfully:', response);
        // Move to the next step in the UI ONLY after successful submission
        this.currentStep = 2;
        // Navigate programmatically to skills page after successful data submission
        this.router.navigate(['/skills']);
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle authentication errors
        if (error.status === 401 || error.status === 403) {
          return this.handleAuthError(error);
        }
        
        console.error('Error updating profile:', error);
        this.errorMessage = error.error?.message || 'Failed to save profile information. Please try again.';
        // Return an observable error
        return throwError(() => new Error(this.errorMessage || 'An unknown error occurred.'));
      }),
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe();
  }

  /**
   * Handles skipping the current step.
   */
  skipForNow(): void {
    console.log('Skipping basic info');
    // Navigate directly to the main dashboard
    this.router.navigate(['/seekerDashboard']);
  }
}