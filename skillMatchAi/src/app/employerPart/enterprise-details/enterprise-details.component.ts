// enterprise-details.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrls: ['./enterprise-details.component.css'],
  imports: [FormsModule, ReactiveFormsModule],
  standalone: true
})
export class EnterpriseDetailsComponent implements OnInit {
  enterpriseForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.enterpriseForm = this.fb.group({
      industry: ['', Validators.required],
      companySize: ['', Validators.required],
      jobTitle: ['', Validators.required],
      companyWebsite: [''],
      companyType: [''],
      headquarter: ['']
    });
  }

  goBack(): void {
    this.router.navigate(['/career-fields']);
  }

  onDone(): void {
    if (this.enterpriseForm.valid) {
      this.router.navigate(['/job-listings']);
    } else {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.enterpriseForm.controls).forEach(key => {
        const control = this.enterpriseForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}