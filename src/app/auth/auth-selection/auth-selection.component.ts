// auth-selection.component.ts
import { Component } from '@angular/core';
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
  constructor(private router: Router) {}
  
  navigateToAuth(userType: string) {
    // Store the user type in local storage
    localStorage.setItem('userType', userType);
    
    // Navigate to different routes based on user type
    switch(userType) {
      case 'jobseeker':
        this.router.navigate(['/auth/register']);
        break;
      case 'employer':
        this.router.navigate(['/employerSignup']);
        break;
      case 'admin':
        this.router.navigate(['/auth/admin-register']);
        break;
      default:
        this.router.navigate(['/auth/register'], { queryParams: { type: userType } });
    }
  }
}