import { Component, OnInit, inject } from '@angular/core'; // Use inject
import { Router, RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// Interface for user data from localStorage (align with LoginComponent/SeekerDashboardComponent)
interface StoredUser {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  // Add profile completion status if available from login/profile API response
  profile_completion?: number; // Example: 0-100
  [key: string]: any; // Allow other properties
}

@Component({
  selector: 'app-seeker', // Consider renaming if appropriate (e.g., 'app-profile-onboarding')
  templateUrl: './jobseeker.component.html', // Ensure this matches your HTML file
  styleUrls: ['./jobseeker.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink]
})
export class JobseekerComponent implements OnInit {
  // User properties - initialize with defaults or loading states
  username: string = 'Loading...';
  profileStatus: string = 'Loading...'; // Or derive from completion percentage
  currentStep: number = 1; // Will be updated based on profile completion
  profileCompletionPercentage: number = 0; // Store the completion value

  // Store userId internally after fetching from localStorage
  private userId: string | number | null = null;

  errorMessage: string | null = null;

  // Use inject for cleaner dependency injection
  private router = inject(Router);
  // Keep ActivatedRoute in case you need to handle deep links with query params later
  private route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit(): void {
    this.loadUserData();
    // Optional: Handle initial query params if needed for deep linking (e.g., ?step=2)
    // this.route.queryParams.subscribe(params => { ... });
  }

  /**
   * Loads user data from localStorage and determines the onboarding state.
   * Recommendation: Move localStorage access to an AuthService.
   */
  loadUserData(): void {
    this.errorMessage = null;
    const userString = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken'); // Check if token exists for session validity

    if (userString && authToken) { // Ensure user data and token exist
      try {
        const storedUser: StoredUser = JSON.parse(userString);

        // Validate essential user data
        if (!storedUser?.id || !storedUser.first_name || !storedUser.last_name) {
          throw new Error("Stored user data is incomplete or invalid.");
        }

        this.userId = storedUser.id;
        this.username = `${storedUser.first_name} ${storedUser.last_name}`;

        // --- Determine currentStep and profileStatus ---
        // This logic needs to align with how your backend calculates/stores completion.
        // Using a hypothetical 'profile_completion' field (0-100) from the user object.
        this.profileCompletionPercentage = storedUser.profile_completion || 0;

        // Example logic to map percentage to step (adjust thresholds as needed)
        if (this.profileCompletionPercentage < 34) {
            this.currentStep = 1;
            this.profileStatus = 'Getting Started';
        } else if (this.profileCompletionPercentage < 67) {
            this.currentStep = 2;
            this.profileStatus = 'Adding Skills';
        } else if (this.profileCompletionPercentage < 100) {
            this.currentStep = 3;
            this.profileStatus = 'Uploading Resume';
        } else {
            this.currentStep = 4; // Represents completion
            this.profileStatus = 'Profile Complete';
            // Optional: Redirect if profile is already complete upon loading
            // console.log('Profile already complete, redirecting to dashboard.');
            // this.router.navigate(['/seekerDashboard']);
            // return; // Stop further processing if redirected
        }
        // Ensure the progress bar in your template uses `profileCompletionPercentage` or `currentStep` correctly.

        console.log(`User data loaded: ${this.username}, ID: ${this.userId}, Completion: ${this.profileCompletionPercentage}%, Current Step: ${this.currentStep}`);

      } catch (error: any) {
        console.error('Error loading/parsing user data:', error);
        this.errorMessage = `Failed to load profile data: ${error.message}. Please try logging in again.`;
        this.username = 'Error';
        this.profileStatus = 'Error';
        // Consider clearing invalid data and redirecting
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        this.router.navigate(['/auth/login']);
      }
    } else {
      console.warn('User data or auth token not found in localStorage. Redirecting to login.');
      this.errorMessage = 'Your session is invalid or has expired. Please log in.';
      this.username = 'Not Logged In';
      this.profileStatus = 'Unknown';
      // Redirect to login if essential data is missing
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Navigates to the specified onboarding step route.
   * @param stepNumber The step number to navigate to (1, 2, or 3).
   */
  goToStep(stepNumber: number): void {
    // Prevent navigation if user data isn't loaded (e.g., during initial load or error)
    if (!this.userId) {
        this.errorMessage = "Cannot navigate: User data not available.";
        console.warn('Attempted navigation before user data was loaded.');
        return;
    }

    // Update the current step state if needed for UI feedback within this component
    this.currentStep = stepNumber;

    let routePath: string;
    switch(stepNumber) {
      case 1:
        // Define the actual routes for your onboarding steps
        routePath = '/onboarding/profile'; // Example route
        break;
      case 2:
        routePath = '/onboarding/skills'; // Example route
        break;
      case 3:
        routePath = '/onboarding/resume'; // Example route
        break;
      default:
        console.warn('Invalid step number requested:', stepNumber);
        return; // Do not navigate for invalid steps
    }

    console.log(`Navigating to step ${stepNumber}: ${routePath}`);
    // Navigate without passing userId in queryParams, assuming target components
    // can retrieve user info from localStorage or a shared service.
    this.router.navigate([routePath]);
  }

  /**
   * Completes the onboarding process and navigates to the main dashboard.
   */
  completeOnboarding(): void {
    // Add any final validation or API calls if necessary before completing.
    console.log('Completing onboarding and navigating to dashboard.');

    // Navigate to dashboard - no need for queryParams if dashboard loads user data itself.
    this.router.navigate(['/seekerDashboard']);
  }
}
