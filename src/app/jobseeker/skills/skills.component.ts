// skills.component.ts
import { Component, OnInit, inject } from '@angular/core'; // Added inject
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Removed ReactiveFormsModule as it's not used here
import { Router, RouterLink, RouterModule } from '@angular/router'; // Added Router
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientModule } from '@angular/common/http'; // Added HttpClient related imports
import { forkJoin, of, throwError } from 'rxjs'; // Added forkJoin, of, throwError
import { catchError, finalize, tap } from 'rxjs/operators'; // Added RxJS operators

// Define the Skill interface matching your data, including ID
interface Skill {
  id: number; // Or string, depending on your DB schema
  name: string;
  description: string;
  category: string; // Added category for better structure
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  // Added HttpClientModule
  imports: [CommonModule, FormsModule, RouterLink, RouterModule, HttpClientModule],
  standalone: true
})
export class SkillsComponent implements OnInit {
  // --- Properties ---
  categories: string[] = [
    'Programming',
    'Design',
    'Marketing',
    'Business',
    'Data science',
    'Project Management',
    'Communication',
    'Finance',
    'Human Resources',
    'Sales'
  ]; // Example categories - Consider fetching from backend

  selectedCategory: string = 'Programming';
  searchQuery: string = '';

  // IMPORTANT: Update this structure to include skill IDs and category
  // Ideally, fetch this data from your backend API (e.g., GET /api/skills)
  skills: { [category: string]: Skill[] } = {
    'Programming': [
      { id: 1, name: 'JavaScript', description: 'Programming language', category: 'Programming' },
      { id: 2, name: 'React', description: 'Frontend framework', category: 'Programming' },
      { id: 3, name: 'Angular', description: 'Frontend framework', category: 'Programming' },
      { id: 4, name: 'Vue.js', description: 'Frontend framework', category: 'Programming' },
      { id: 5, name: 'Node.js', description: 'Backend development', category: 'Programming' },
      { id: 6, name: 'Python', description: 'Programming language', category: 'Programming' },
      { id: 7, name: 'Java', description: 'Programming language', category: 'Programming' },
      { id: 8, name: 'Ruby', description: 'Programming language', category: 'Programming' }
    ],
    'Design': [
      { id: 10, name: 'UI Design', description: 'User interface design', category: 'Design' },
      { id: 11, name: 'UX Design', description: 'User experience design', category: 'Design' }
    ],
    // Other categories would be populated similarly
  };

  selectedSkills: string[] = []; // Start with empty selection or load previously saved skills
  isLoading = false;
  errorMessage: string | null = null;

  // --- Injected Services ---
  private http = inject(HttpClient);
  private router = inject(Router);

  // --- API Configuration ---
  // Use the same base URL as your other components
  private apiUrl = 'http://localhost:5000/api';

  constructor() { }

  ngOnInit(): void {
    // TODO: Fetch categories and skills (including IDs) from your backend API
    // this.fetchSkills();
    // TODO: Fetch user's currently saved skills to pre-populate selectedSkills
    // this.loadUserSkills();
   }

  // --- Methods ---

  // Placeholder for fetching skills from backend
  // fetchSkills(): void {
  //   this.isLoading = true;
  //   this.http.get<Skill[]>(`${this.apiUrl}/skills`) // Assuming a general skills endpoint exists
  //     .pipe(finalize(() => this.isLoading = false))
  //     .subscribe({
  //       next: (allSkills) => {
  //         // Group skills by category
  //         this.skills = allSkills.reduce((acc, skill) => {
  //           const category = skill.category || 'Other';
  //           if (!acc[category]) {
  //             acc[category] = [];
  //           }
  //           acc[category].push(skill);
  //           return acc;
  //         }, {} as { [category: string]: Skill[] });
  //         this.categories = Object.keys(this.skills).sort();
  //         this.selectedCategory = this.categories[0] || '';
  //       },
  //       error: (err) => this.errorMessage = 'Failed to load skills.'
  //     });
  // }

  // Placeholder for loading user's existing skills
  // loadUserSkills(): void {
  //    this.http.get<{ data: { name: string }[] }>(`${this.apiUrl}/users/skills`, { headers: this.getAuthHeaders() })
  //      .subscribe({
  //        next: (res) => this.selectedSkills = res.data.map(s => s.name),
  //        error: (err) => console.error('Failed to load user skills', err)
  //      });
  // }


  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  toggleSkill(skillName: string): void {
    if (this.isSkillSelected(skillName)) {
      // Note: Removing a skill might require a DELETE request if already saved
      this.removeSkill(skillName);
    } else {
      this.selectedSkills.push(skillName);
    }
  }

  isSkillSelected(skillName: string): boolean {
    return this.selectedSkills.includes(skillName);
  }

  removeSkill(skillName: string): void {
    this.selectedSkills = this.selectedSkills.filter(skill => skill !== skillName);
    // TODO: If skills are loaded from backend, you might need to send a
    // DELETE request here to /api/users/skills/:skillId
  }

  // Helper to find the Skill object (including ID) by its name
  findSkillByName(skillName: string): Skill | undefined {
    for (const category in this.skills) {
      const found = this.skills[category].find(s => s.name === skillName);
      if (found) {
        return found;
      }
    }
    console.warn(`Skill object not found for name: ${skillName}`);
    return undefined;
  }

  // Helper to get authentication token (consistent with LoginComponent)
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Helper to create HTTP headers with Authorization
  getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
        console.error("Auth token not found for request headers.");
        // Handle missing token - maybe redirect to login
        this.router.navigate(['/auth/login']);
    }
    return headers;
  }

  goBack(): void {
    // Navigate back to the profile step (adjust path if needed)
    this.router.navigate(['/jobProfile']); // Or '/onboarding/profile' depending on your routes
    console.log('Going back to previous step');
  }

  /**
   * Submits selected skills to the backend and navigates to the resume page.
   */
  continue(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Create an array of POST request observables for each selected skill
    const addSkillRequests = this.selectedSkills.map(skillName => {
      const skill = this.findSkillByName(skillName);
      if (!skill || !skill.id) {
        console.warn(`Skill ID not found for selected skill: ${skillName}. Skipping.`);
        // Return an observable that emits null to allow forkJoin to continue
        return of({ error: true, skillName: skillName, message: 'Skill ID not found in frontend data.' });
      }

      // Payload expected by POST /api/users/skills
      const payload = {
        skillId: skill.id,
        proficiencyLevel: null // Set a default or null proficiency for now
      };

      const addUrl = `${this.apiUrl}/users/skills`; // Backend endpoint to add a skill for the user

      console.log(`Preparing POST request to ${addUrl} for skill: ${skill.name} (ID: ${skill.id})`);

      return this.http.post(addUrl, payload, { headers: this.getAuthHeaders() }).pipe(
        tap(response => console.log(`Successfully added skill: ${skill.name}`, response)),
        catchError((error: HttpErrorResponse) => {
          console.error(`Error adding skill ${skillName} (ID: ${skill.id}):`, error);
          // Return an observable emitting an error object for this specific request
          // This allows forkJoin to complete even if some requests fail
          let errorMessage = `Failed to add skill: ${skillName}. `;
          if (error.status === 400 && error.error?.error?.includes('already added')) {
              errorMessage += 'Skill may already be in your profile.';
              // Treat "already added" as a soft error or success for navigation purposes
              return of({ success: true, skillName: skillName, message: 'Already added' });
          } else {
              errorMessage += error.error?.error || error.message || 'Unknown error.';
          }
          return of({ error: true, skillName: skillName, message: errorMessage });
        })
      );
    });

    // If no skills were selected, navigate directly
    if (addSkillRequests.length === 0) {
        console.log("No new skills selected to add. Proceeding to resume page.");
        this.isLoading = false;
        this.router.navigate(['/resume']); // Navigate to the next step
        return;
    }

    // Use forkJoin to execute all add requests in parallel
    forkJoin(addSkillRequests).pipe(
      finalize(() => {
        this.isLoading = false; // Ensure loading state is turned off
      })
    ).subscribe({
      next: (results) => {
        console.log('Add skill requests results:', results);
        // Check if any individual request returned an error object
        const failedRequests = results.filter((res): res is { error: boolean; skillName: string; message: string } => res && 'error' in res && res.error === true);

        if (failedRequests.length > 0) {
          // Handle partial success/failure - display messages for failed ones
          const failedSkillNames = failedRequests
            .filter((f): f is { error: boolean; skillName: string; message: string } => 'skillName' in f)
            .map(f => f.skillName);
          this.errorMessage = `Could not add some skills: ${failedSkillNames.join(', ')}. Please check your profile later.`;
          console.error('Failed skill details:', failedRequests);
          // Still navigate even if some failed, as others might have succeeded
          this.router.navigate(['/resume']);
        } else {
          console.log('All selected skills processed successfully.');
          // Navigate to the next step (resume page)
          this.router.navigate(['/resume']);
        }
      },
      error: (error) => {
        // This catches errors if forkJoin itself fails (less common)
        console.error('Unexpected error during forkJoin execution for skills:', error);
        this.errorMessage = 'An unexpected error occurred while saving skills. Please try again.';
      }
    });
  }
}
