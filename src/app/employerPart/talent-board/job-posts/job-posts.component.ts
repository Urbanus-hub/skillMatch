// job-post.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

// Basic auth service interface - you'll implement this properly later
interface AuthService {
  getToken(): string | null;
}

// Simple auth service implementation
class BasicAuthService implements AuthService {
  getToken(): string | null {
    // This is a placeholder - in a real app, you'd retrieve from localStorage, sessionStorage, etc.
    // Example: return localStorage.getItem('auth_token');
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }
}

@Component({
  selector: 'app-job-post',
  templateUrl: './job-posts.component.html',
  styleUrls: ['./job-posts.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  standalone: true,
  providers: [
    { provide: 'AuthService', useClass: BasicAuthService }
  ]
})
export class JobPostsComponent implements OnInit {
  jobs: Job[] = [];
  jobForm: FormGroup;
  showPostForm = false;
  viewMode = 'list'; // 'list' or 'grid'
  filterText = '';
  private authService: AuthService;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.authService = new BasicAuthService(); // Simple implementation
    
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
    // Mock data for demonstration
    this.jobs = [
      {
        id: 1,
        title: 'Senior Data Scientist',
        company: 'DataInsights LLC',
        location: 'San Francisco, CA',
        type: 'Full-time',
        description: 'We are looking for a Senior Data Scientist to join our team. You will be responsible for analyzing data, building machine learning models, and providing insights to our clients.',
        requirements: ['5+ years of experience in data science', 'Proficiency in Python, R, and SQL', 'Experience with machine learning algorithms', 'PhD or MS in Statistics, Computer Science or related field'],
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
        description: 'We are seeking a talented Frontend Developer to create responsive and user-friendly web applications.',
        requirements: ['3+ years of experience with Angular', 'Strong knowledge of TypeScript', 'Experience with RESTful APIs', 'Familiarity with CSS preprocessors'],
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
        description: 'Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.',
        requirements: ['Portfolio showcasing UI/UX projects', 'Proficiency in Figma and Adobe Creative Suite', 'Understanding of user-centered design principles', '2+ years of experience in a similar role'],
        postedDate: new Date('2025-04-18'),
        deadline: new Date('2025-05-18'),
        salary: '$90,000 - $110,000',
        contactEmail: 'design@creativeminds.com'
      }
    ];
    
    // You could load jobs from API here with auth token
    this.loadJobs();
  }

  loadJobs(): void {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Example of getting jobs with authentication
    this.http.get<Job[]>('http://localhost:3000/api/jobs', { headers })
      .subscribe({
        next: (jobs) => {
          // Use this if you want to replace mock data with real data
          // this.jobs = jobs;
          console.log('Jobs loaded successfully');
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
        id: 0, // backend will assign id
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

      // Get token and set headers
      const token = localStorage.getItem('token');
      console.log(token);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Include headers in request
      this.http.post<Job>('http://localhost:3000/api/jobs', newJob, { headers })
        .subscribe({
          next: (job) => {
            this.jobs.unshift(job);
            this.togglePostForm();
          },
          error: (err) => {
            console.error('Failed to post job', err);
            // Handle specific error cases
            if (err.status === 401) {
              console.log('Authentication failed. Please login again.');
              // Here you could redirect to login page or show a login dialog
            }
          }
        });
    }
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  getDaysAgo(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
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
    const diffTime = Math.abs(date.getTime() - now.getTime());
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