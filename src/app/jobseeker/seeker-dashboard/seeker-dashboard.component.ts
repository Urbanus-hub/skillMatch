// skillmatch-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface User {
  name: string;
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
}

@Component({
  selector: 'app-seeker-dashboard',
  templateUrl: './seeker-dashboard.component.html',
  styleUrls: ['./seeker-dashboard.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class SeekerDashboardComponent implements OnInit {
  user = {
    name: 'Urbanus Kioko',
    profileImage: 'assets/profile.jpg',
    profileCompletion: 85,
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS', 'HTML5'],
    experience: '5 years',
    education: 'BS Computer Science',
    location: 'San Francisco, CA',
    jobTitle: 'Senior Frontend Developer'
  };

  notifications: Notification[] = [
    {
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Technical Interview with Google',
      time: 'Tomorrow',
      isNew: true
    },
    {
      type: 'application',
      title: 'Application Update',
      description: 'Your application was viewed by Microsoft',
      time: '1 hour ago'
    },
    {
      type: 'message',
      title: 'New Message',
      description: 'Recruiter from Amazon sent you a message',
      time: '3 hours ago'
    },
    {
      type: 'job',
      title: 'Job Match Found',
      description: 'New job matches your profile at Netflix',
      time: 'Yesterday'
    }
  ];

  recommendedJobs: Job[] = [
    {
      title: 'Senior React Developer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$140K - $180K',
      posted: '2 days ago',
      matchPercentage: 95
    },
    {
      title: 'Full Stack Engineer',
      company: 'Microsoft',
      location: 'Seattle, WA (Remote)',
      salary: '$130K - $160K',
      posted: '1 day ago',
      matchPercentage: 88
    },
    {
      title: 'Frontend Team Lead',
      company: 'Facebook',
      location: 'Menlo Park, CA',
      salary: '$150K - $190K',
      posted: '3 days ago',
      matchPercentage: 82
    }
  ];

  activeSection = 'profile';
  
  // New properties for the toggle features
  sidebarCollapsed = false;
  showNotifications = true;

  constructor() {}

  ngOnInit(): void {
    // Initialize dashboard animations
    this.animateElements();
  }

  animateElements(): void {
    // Add animation classes to elements once loaded
    setTimeout(() => {
      const cards = document.querySelectorAll('.dashboard-card');
      cards.forEach((card, index) => {
        const element = card as HTMLElement;
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-in');
      });
    }, 100);
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }
  
  // New methods for the toggle features
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
  markAllAsRead(): void {
    // Mark all notifications as read
    this.notifications.forEach(notification => {
      notification.isNew = false;
    });
    
    // Hide notifications panel
    this.showNotifications = false;
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}