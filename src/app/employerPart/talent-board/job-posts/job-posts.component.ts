// job-post.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  deadline: Date;
  salary: string;
  contactEmail: string;
}

@Component({
  selector: 'app-job-post',
  templateUrl: './job-posts.component.html',
  styleUrls: ['./job-posts.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  standalone: true,
})
export class JobPostsComponent implements OnInit {
  jobs: Job[] = [];
  jobForm: FormGroup;
  showPostForm = false;
  viewMode = 'list';
  filterText = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      type: ['Full-time', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      salary: ['', Validators.required],
      deadline: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.jobs = [
      {
        id: 1,
        title: 'Senior Data Scientist',
        company: 'DataInsights LLC',
        location: 'San Francisco, CA',
        type: 'Full-time',
        description: 'We are looking for a Senior Data Scientist to join our team.',
        requirements: ['5+ years of experience in data science', 'Proficiency in Python, R, and SQL'],
        postedDate: new Date('2025-04-15'),
        deadline: new Date('2025-05-15'),
        salary: '$150,000 - $180,000',
        contactEmail: 'careers@datainsights.com'
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'TechSolutions Inc.',
        location: 'Remote',
        type: 'Contract',
        description: 'We are seeking a talented Frontend Developer.',
        requirements: ['3+ years of experience with Angular', 'Strong knowledge of TypeScript'],
        postedDate: new Date('2025-04-20'),
        deadline: new Date('2025-05-20'),
        salary: '$100,000 - $130,000',
        contactEmail: 'hr@techsolutions.com'
      },
      {
        id: 3,
        title: 'UI/UX Designer',
        company: 'CreativeMinds',
        location: 'New York, NY',
        type: 'Full-time',
        description: 'Join our creative team to design UI/UX.',
        requirements: ['Portfolio showcasing UI/UX projects', 'Proficiency in Figma'],
        postedDate: new Date('2025-04-18'),
        deadline: new Date('2025-05-18'),
        salary: '$90,000 - $110,000',
        contactEmail: 'design@creativeminds.com'
      }
    ];

    this.loadJobs();
  }

  loadJobs(): void {
    this.http.get<Job[]>('http://localhost:3000/api/jobs')
      .subscribe({
        next: (jobs) => {
          console.log('Jobs loaded successfully');
          // this.jobs = jobs;
        },
        error: (err) => {
          console.error('Failed to load jobs', err);
        }
      });
  }

  togglePostForm(): void {
    this.showPostForm = !this.showPostForm;
    if (!this.showPostForm) {
      this.jobForm.reset();
    }
  }

  submitJob(): void {
    if (this.jobForm.valid) {
      const newJob: Job = {
        id: 0,
        title: this.jobForm.value.title,
        company: this.jobForm.value.company,
        location: this.jobForm.value.location,
        type: this.jobForm.value.type,
        description: this.jobForm.value.description,
        requirements: this.jobForm.value.requirements.split('\n'),
        postedDate: new Date(),
        deadline: new Date(this.jobForm.value.deadline),
        salary: this.jobForm.value.salary,
        contactEmail: this.jobForm.value.contactEmail
      };

      this.http.post<Job>('http://localhost:3000/api/jobs', newJob)
        .subscribe({
          next: (job) => {
            this.jobs.unshift(job);
            this.togglePostForm();
          },
          error: (err) => {
            console.error('Failed to post job', err);
          }
        });
    }
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  getDaysAgo(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  }

  getDaysLeft(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(new Date(date).getTime() - now.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get filteredJobs(): Job[] {
    return this.jobs.filter(job => {
      return job.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
             job.company.toLowerCase().includes(this.filterText.toLowerCase()) ||
             job.location.toLowerCase().includes(this.filterText.toLowerCase());
    });
  }
}
