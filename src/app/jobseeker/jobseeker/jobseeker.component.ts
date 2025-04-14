import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seeker',
  templateUrl: './jobseeker.component.html',
  styleUrls: ['./jobseeker.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class JobseekerComponent implements OnInit {
  username: string = 'Urbanus Kioko';
  profileStatus: string = 'New user';
  currentStep: number = 1;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Any initialization logic
  }

  goToStep(stepNumber: number): void {
    switch(stepNumber) {
      case 1:
        this.router.navigate(['profile'], { relativeTo: this.router.routerState.root });
        break;
      case 2:
        this.router.navigate(['skills'], { relativeTo: this.router.routerState.root });
        break;
      case 3:
        this.router.navigate(['resume'], { relativeTo: this.router.routerState.root });
        break;
      default:
        break;
    }
  }

  completeOnboarding(): void {
    // Complete the onboarding process
    this.router.navigate(['/dashboard']);
  }
}