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
    // Store the user type in local storage or state management
    localStorage.setItem('userType', userType);
    
    // Navigate to the login page with the user type as a parameter
    this.router.navigate(['/auth/register'], { queryParams: { type: userType } });
  }
}