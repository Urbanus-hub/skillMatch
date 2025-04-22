// seeker-dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import RouterLink and RouterModule for the template
import { Router, RouterLink, RouterModule } from '@angular/router'; // Ensure RouterModule is imported

// Interface for the basic user data stored in localStorage
interface BasicUser {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  // Add other fields if stored during login
}

// Interface for the data structure used by the dashboard template
// We'll populate 'name' from localStorage, others remain dummy for now
interface DashboardUser {
  name: string; // Combined first and last name
  profileImage: string;
  profileCompletion: number;
  skills: string[];
  experience: string | any; // Changed to allow for object structure
  education: string | any; // Changed to allow for object structure
  location: string;
  jobTitle: string;
  // Add email or other fields if needed by the template directly
  email?: string;
  userType?: string;
  id?: number | string;
}

interface Notification {
  type: string;
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
}

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  matchPercentage: number;
  highlights?: string[]; // Added for job highlights/skills
}

// Added interface for upcoming interviews
interface Interview {
  company: string;
  position: string;
  time: string;
  logoUrl: string;
  type: string;
}

@Component({
  selector: 'app-seeker-dashboard',
  templateUrl: './seeker-dashboard.component.html',
  styleUrls: ['./seeker-dashboard.component.css'],
  // Ensure RouterModule is included for router-outlet, routerLink, routerLinkActive
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, RouterLink],
  standalone: true
})
export class SeekerDashboardComponent implements OnInit {

  // --- User Data ---
  user: DashboardUser = {
    name: 'Loading...',
    profileImage: 'https://images.unsplash.com/photo-1693287728946-058e154f3a14?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    profileCompletion: 85,
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS', 'HTML5'],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        period: 'Jan 2021 - Present (2 years 3 months)',
        description: 'Leading frontend development team, implementing React applications and improving performance.',
        logo: 'man1.png'
      },
      {
        title: 'Frontend Developer',
        company: 'InnovateSoft',
        period: 'Mar 2018 - Dec 2020 (2 years 9 months)',
        description: 'Developed and maintained frontend applications using React and Node.js.',
        logo: 'people.png'
      }
    ],
    education: [
      {
        degree: 'BS Computer Science',
        institution: 'University of Technology',
        period: '2014 - 2018',
        description: 'Focus on software engineering and web development.',
        logo: 'people.png'
      }
    ],
    location: 'San Francisco, CA',
    jobTitle: 'Senior Frontend Developer'
  };
  errorMessage: string | null = null;

  // --- Dummy Data ---
  notifications: Notification[] = [
    { type: 'interview', title: 'Interview Scheduled', description: 'Technical Interview with Google', time: 'Tomorrow', isNew: true },
    { type: 'application', title: 'Application Update', description: 'Your application was viewed by Microsoft', time: '1 hour ago' },
    { type: 'message', title: 'New Message', description: 'Recruiter from Amazon sent you a message', time: '3 hours ago' },
    { type: 'job', title: 'Job Match Found', description: 'New job matches your profile at Netflix', time: 'Yesterday' }
  ];

  recommendedJobs: Job[] = [
    {
      title: 'Senior React Developer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$140K - $180K',
      posted: '2 days ago',
      matchPercentage: 95,
      highlights: ['JavaScript', 'React', 'Node.js']
    },
    {
      title: 'Full Stack Engineer',
      company: 'Microsoft',
      location: 'Seattle, WA (Remote)',
      salary: '$130K - $160K',
      posted: '1 day ago',
      matchPercentage: 88,
      highlights: ['JavaScript', 'React', 'Node.js']
    },
    {
      title: 'Frontend Team Lead',
      company: 'Facebook',
      location: 'Menlo Park, CA',
      salary: '$150K - $190K',
      posted: '3 days ago',
      matchPercentage: 82,
      highlights: ['JavaScript', 'React', 'Node.js']
    }
  ];

  upcomingInterviews: Interview[] = [
    {
      company: 'Google',
      position: 'Frontend Developer',
      time: 'Tomorrow, 10:00 AM',
      logoUrl: 'man1.png',
      type: 'Technical Interview'
    }
  ];
  // --- End Dummy Data ---

  // REMOVED activeSection property
  sidebarCollapsed = false;
  showNotifications = false;

  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.loadUserName();
    this.animateElements();
  }

  loadUserName(): void {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const basicUser: BasicUser = JSON.parse(userString);
        if (!basicUser || !basicUser.first_name || !basicUser.last_name) {
            throw new Error("Stored user data is missing name fields.");
        }
        this.user = {
          ...this.user,
          name: `${basicUser.first_name} ${basicUser.last_name}`,
          email: basicUser.email,
          userType: basicUser.user_type,
          id: basicUser.id
        };
        console.log('User name loaded:', this.user.name);
        this.errorMessage = null;
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        this.errorMessage = 'Could not load user name. Please try logging in again.';
        this.user.name = 'Error Loading Name';
      }
    } else {
      console.warn('No user data found in localStorage.');
      this.errorMessage = 'You are not logged in.';
      this.user.name = 'Not Logged In';
    }
  }

  navigateToProfileEdit(): void {
    // Get auth token and user ID
    const authToken = localStorage.getItem('authToken');
    const userId = this.user.id;
    
    // Navigate with query parameters (not secure for tokens)
    this.router.navigate(['/jobSeeker'], { 
      queryParams: { 
        userId: userId // Security risk - not recommended
      }
    });
  }

  animateElements(): void {
    // Add animation classes to elements once loaded
    setTimeout(() => {
      const cards = document.querySelectorAll('.dashboard-card');
      cards.forEach((card, index) => {
        const element = card as HTMLElement;
        if (element.style) {
            element.style.animationDelay = `${index * 0.1}s`;
        }
        element.classList.add('animate-in');
      });
    }, 100);
  }

  // REMOVED setActiveSection method

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isNew = false;
    });
    // Optionally hide panel after marking read
    // this.showNotifications = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  logout(): void {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      this.router.navigate(['/auth/login']);
  }
}
