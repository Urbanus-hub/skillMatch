// job-seeker-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,RouterLink,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-seeker-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink,RouterModule]
})
export class ProfileComponent implements OnInit {
  currentStep: number = 1;
  basicInfoForm: FormGroup;
  
  experienceLevels = [
    '0-1 years',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];
  
  industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Media',
    'Construction',
    'Transportation',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.basicInfoForm = this.fb.group({
      jobTitle: ['', Validators.required],
      experience: ['', Validators.required],
      industry: ['', Validators.required],
      location: ['', Validators.required],
      summary: ['']
    });
  }

  ngOnInit(): void {}

  goToStep(step: number): void {
    // Navigate between steps
    this.currentStep = step;
  }

  skipForNow(): void {
    // Skip current step and go to next
    this.goToStep(2);
  }

  continue(): void {
    if (this.basicInfoForm.valid) {
      // Save form data and proceed to next step
      console.log('Form data:', this.basicInfoForm.value);
      this.goToStep(2);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.basicInfoForm.controls).forEach(key => {
        this.basicInfoForm.get(key)?.markAsTouched();
      });
    }
  }
}