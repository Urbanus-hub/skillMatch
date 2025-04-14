// skillmatch-onboarding.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-skillmatch-onboarding',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class WelcomeComponent implements OnInit {
  username: string = 'Urbanus Kioko';
  processingActive: boolean = true;
  profileSteps = [
    { name: 'Personal Information', completed: true },
    { name: 'Skills', completed: false },
    { name: 'Upload Resume', completed: false }
  ];

  constructor() { }

  ngOnInit(): void {
    // Start animations
    this.animateElements();
    
    // Simulating redirect after processing
    setTimeout(() => {
      console.log('Redirecting to main page...');
      // In real app: this.router.navigate(['/dashboard']);
    }, 5000);
  }

  animateElements(): void {
    // Handle processing spinner animation
    setInterval(() => {
      const spinner = document.querySelector('.processing-icon') as HTMLElement;
      if (spinner) {
        spinner.style.transform = 'rotate(360deg)';
        spinner.style.transition = 'transform 1s linear';
        
        setTimeout(() => {
          spinner.style.transform = 'rotate(0deg)';
          spinner.style.transition = 'none';
        }, 1000);
      }
    }, 1100);
    
    // Handle progress bar animation
    setTimeout(() => {
      const progressBar = document.querySelector('.progress') as HTMLElement;
      if (progressBar) {
        progressBar.style.width = '60%';
      }
    }, 600);
  }
}