import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';

interface User {
  name: string;
  profileImage?: string;
  jobTitle?: string;
  location?: string;
  skills?: string[];
  experience?: any[]; // You might want to define a more specific interface for experience
  education?: any[]; // You might want to define a more specific interface for education
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  matchPercentage: number;
  skills: string[];
  applicants?: number;
}

@Component({
  selector: 'app-skillmatch-dashboard',
  templateUrl: './profile-skills.component.html',
  styleUrls: ['./profile-skills.component.css'],
  standalone: true,
  imports: [CommonModule, NgIf, NgFor]
})
export class ProfileSkillsComponent implements OnInit {
  activeSection: string = 'profile'; // Default active section
  sidebarCollapsed: boolean = false;
  
  // User data
  user: User = {
    name: 'John Doe',
    profileImage: '',
    jobTitle: 'Frontend Developer',
    location: 'San Francisco, CA',
    skills: ['JavaScript', 'React', 'Angular', 'TypeScript', 'Node.js', 'CSS', 'HTML5']
  };

  // Recommended jobs
  recommendedJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA (Remote)',
      salary: '$120,000 - $150,000 per year',
      posted: '2 days ago',
      matchPercentage: 95,
      skills: ['JavaScript', 'React', 'Node.js']
    },
    {
      id: '2',
      title: 'Frontend Engineer',
      company: 'InnovateSoft',
      location: 'New York, NY',
      salary: '$110,000 - $140,000 per year',
      posted: '3 days ago',
      matchPercentage: 87,
      skills: ['JavaScript', 'Angular', 'TypeScript']
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'Tech Solutions LLC',
      location: 'Remote',
      salary: '$130,000 - $160,000 per year',
      posted: '1 week ago',
      matchPercentage: 82,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check for section parameter in URL
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.activeSection = params['section'];
      }
    });

    // Animation for dashboard cards when page loads
    setTimeout(() => {
      const cards = document.querySelectorAll('.dashboard-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-in');
        }, 100 * (index + 1));
      });
    }, 300);
  }

  // Toggle active section
  setActiveSection(section: string): void {
    this.activeSection = section;
    
    // Update URL with section parameter without navigation
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: section },
      queryParamsHandling: 'merge'
    });
    
    // Reset animations for the new section
    setTimeout(() => {
      const cards = document.querySelectorAll('.dashboard-card');
      cards.forEach((card, index) => {
        card.classList.remove('animate-in');
        setTimeout(() => {
          card.classList.add('animate-in');
        }, 100 * (index + 1));
      });
    }, 100);
  }

  // Toggle sidebar collapse
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Navigate to profile edit page
  navigateToProfileEdit(): void {
    this.router.navigate(['/profile/edit']);
  }
}