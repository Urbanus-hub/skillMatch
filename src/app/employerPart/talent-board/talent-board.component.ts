// talent-board.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,RouterLink,RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Candidate } from './model/canditate.model';

@Component({
  selector: 'app-talent-board',
  templateUrl: './talent-board.component.html',
  styleUrls: ['./talent-board.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,RouterLink,RouterOutlet]
})
export class TalentBoardComponent implements OnInit {
  candidates: Candidate[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'All Categories';
  categories = ['All Categories', 'Information Technology', 'Mathematics', 'Data Science', 'Engineering', 'Design'];
  locations = ['All Locations', 'Manchester', 'London', 'Birmingham', 'Edinburgh', 'Remote'];
  selectedLocation: string = 'All Locations';
  
  constructor() { }

  ngOnInit(): void {
    // Simulate loading data from a service
    this.loadCandidates();
  }

  loadCandidates() {
    // Mock data for the candidates
    this.candidates = [
      {
        id: 1,
        name: 'Ben Awuoko',
        avatar: 'assets/avatars/ben.jpg',
        title: 'Fullstack Developer',
        employer: 'Bensite Limited',
        location: 'Manchester, Britain',
        yearsOfExperience: 9,
        occupation: 'Software Developer',
        education: 'Degree',
        skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'MongoDB'],
        availability: 'Available in 2 weeks',
        projectCount: 34,
        rating: 4.8
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        avatar: 'assets/avatars/sarah.jpg',
        title: 'Frontend Developer',
        employer: 'TechVision Co',
        location: 'London, Britain',
        yearsOfExperience: 5,
        occupation: 'UI Developer',
        education: 'Masters Degree',
        skills: ['React', 'CSS', 'HTML5', 'UX Design', 'Redux'],
        availability: 'Immediately Available',
        projectCount: 22,
        rating: 4.5
      },
      {
        id: 3,
        name: 'Michael Chen',
        avatar: 'assets/avatars/michael.jpg',
        title: 'Backend Developer',
        employer: 'DataFlow Systems',
        location: 'Manchester, Britain',
        yearsOfExperience: 7,
        occupation: 'Software Engineer',
        education: 'PhD in Computer Science',
        skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes'],
        availability: 'Available in 1 month',
        projectCount: 41,
        rating: 4.9
      },
      {
        id: 4,
        name: 'Emma Williams',
        avatar: 'assets/avatars/emma.jpg',
        title: 'DevOps Engineer',
        employer: 'CloudForce Tech',
        location: 'Edinburgh, Britain',
        yearsOfExperience: 6,
        occupation: 'System Administrator',
        education: 'Bachelors in IT',
        skills: ['AWS', 'Terraform', 'Jenkins', 'Linux', 'CI/CD'],
        availability: 'Available in 3 weeks',
        projectCount: 19,
        rating: 4.6
      },
      {
        id: 5,
        name: 'James Rodriguez',
        avatar: 'assets/avatars/james.jpg',
        title: 'Data Scientist',
        employer: 'AnalyticsPro',
        location: 'Remote',
        yearsOfExperience: 4,
        occupation: 'Data Analyst',
        education: 'Masters in Data Science',
        skills: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'SQL'],
        availability: 'Immediately Available',
        projectCount: 15,
        rating: 4.7
      }
    ];
  }

  filterCandidates() {
    // In a real app, this would be handled by a service with proper filtering
    console.log(`Filtering by: ${this.searchQuery} - ${this.selectedCategory} - ${this.selectedLocation}`);
  }

  viewCandidateDetails(candidateId: number) {
    console.log(`Viewing candidate details for ID: ${candidateId}`);
    // Navigate to candidate details in a real app
  }

  contactCandidate(candidateId: number) {
    console.log(`Contacting candidate with ID: ${candidateId}`);
    // Open contact modal in a real app
  }

  saveCandidateProfile(candidateId: number) {
    console.log(`Saving candidate profile for ID: ${candidateId}`);
    // Save to user's saved profiles in a real app
  }
}