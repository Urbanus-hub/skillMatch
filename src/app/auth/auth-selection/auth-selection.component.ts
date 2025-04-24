// auth-selection.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-selection.component.html',
  styleUrls: ['./auth-selection.component.css']
})
export class AuthSelectionComponent {
  private router = inject(Router);

  navigateToAuth(userType: string): void {
    // Define the target routes
    const registrationRoute = '/auth/register';
    // const logRoute = '/auth/login'; // Keep if needed elsewhere, but not used for registration flow here
    const adminRoute = '/auth/login';

    // Navigate based on user type
    switch (userType) {
      // Handle the value coming from the template
      case 'job_seeker': // Handle the value expected by the backend/register component
        // Navigate both variations to registration with the standardized 'job_seeker' query param
        this.router.navigate([registrationRoute], { queryParams: { userType: 'job_seeker' } });
        break;
      case 'employer':
        // Navigate employer to registration with 'employer' query param
        this.router.navigate([registrationRoute], { queryParams: { userType: "employer" } });
        break;
      case 'admin':
        // Admin goes to their dashboard, likely doesn't need the userType query param
        this.router.navigate([adminRoute], { queryParams: { userType: "admin" } });
        break;
      default:
        // Handle truly unexpected user types
        console.warn(`Unexpected userType received: ${userType}. Navigating to default registration.`);
        // Fallback to registration route without a specific type, or redirect to selection
        this.router.navigate([registrationRoute]); // Or perhaps navigate back to selection: this.router.navigate(['/auth-selection']);
        break;
    }
  }
}
