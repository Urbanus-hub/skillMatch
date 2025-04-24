// talent-board.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


interface Candidate {
  id: number;
  name: string;
  title: string;
  yearsOfExperience: number;
  employer: string;
  occupation: string;
  location: string;
  education: string;
  skills: string[];
  projectCount: number;
  rating: number;
  availability: string;
  avatar: string;
  category: string;
}

@Component({
  selector: 'app-talent-board',
  templateUrl: './talents.component.html',
  styleUrls: ['./talents.component.css'],
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  standalone: true
})
export class TalentsComponent implements OnInit {
  categories: string[] = [
    'All Categories',
    'Information Technology and Mathematics',
    'Data Science and Analytics',
    'Engineering and Architecture',
    'Design and Creative'
  ];
  
  locations: string[] = [
    'All Locations',
    'Remote',
    'New York',
    'San Francisco',
    'London',
    'Berlin',
    'Toronto',
    'Singapore'
  ];
  
  candidates: Candidate[] = []; // Will be populated in ngOnInit
  filteredCandidates: Candidate[] = [];
  
  selectedCategory: string = 'All Categories';
  selectedLocation: string = 'All Locations';
  viewMode: string = 'list'; // 'list' or 'grid'
  
  constructor() { }
  
  ngOnInit(): void {
    // Populate with mock data
    this.candidates = this.generateMockCandidates();
    this.filterCandidates();
  }
  
  filterCandidates(): void {
    this.filteredCandidates = this.candidates.filter(candidate => {
      const categoryMatch = this.selectedCategory === 'All Categories' || 
                           candidate.category === this.selectedCategory;
      const locationMatch = this.selectedLocation === 'All Locations' || 
                           candidate.location === this.selectedLocation;
      return categoryMatch && locationMatch;
    });
  }
  
  setCategory(category: string): void {
    this.selectedCategory = category;
    this.filterCandidates();
  }
  
  setViewMode(mode: string): void {
    this.viewMode = mode;
  }
  
  viewCandidateDetails(candidateId: number): void {
    console.log(`Viewing profile of candidate ${candidateId}`);
    // Implementation for navigating to candidate details
  }
  
  contactCandidate(candidateId: number): void {
    console.log(`Contacting candidate ${candidateId}`);
    // Implementation for contacting candidate
  }
  
  saveCandidateProfile(candidateId: number): void {
    console.log(`Saving profile of candidate ${candidateId}`);
    // Implementation for saving candidate profile
  }
  
  private generateMockCandidates(): Candidate[] {
    const mockData: Candidate[] = [
      {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Senior Full Stack Developer',
        yearsOfExperience: 8,
        employer: 'TechSolutions Inc.',
        occupation: 'Software Development',
        location: 'New York',
        education: 'M.S. Computer Science',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        projectCount: 47,
        rating: 4.9,
        availability: 'Available in 2 weeks',
        avatar: 'people.jpg',
        category: 'Information Technology and Mathematics'
      },
      {
        id: 2,
        name: 'Michael Chen',
        title: 'Data Scientist',
        yearsOfExperience: 5,
        employer: 'DataInsights LLC',
        occupation: 'Data Analysis',
        location: 'San Francisco',
        education: 'Ph.D. Statistics',
        skills: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'SQL'],
        projectCount: 32,
        rating: 4.7,
        availability: 'Immediately Available',
        avatar: 'man1.jpg',
        category: 'Data Science and Analytics'
      },
      {
        id: 3,
        name: 'Elena Rodriguez',
        title: 'UI/UX Designer',
        yearsOfExperience: 6,
        employer: 'Creative Design Studio',
        occupation: 'Design',
        location: 'Remote',
        education: 'B.F.A. Graphic Design',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping'],
        projectCount: 38,
        rating: 4.8,
        availability: 'Available in 1 month',
        avatar: 'happy.jpg',
        category: 'Design and Creative'
      },
      {
        id: 4,
        name: 'David Lee',
        title: 'Mechanical Engineer',
        yearsOfExperience: 10,
        employer: 'EngineTech Corp',
        occupation: 'Engineering',
        location: 'Toronto',
        education: 'M.Eng. Mechanical Engineering',
        skills: ['AutoCAD', 'SolidWorks', 'Thermodynamics', 'Project Management'],
        projectCount: 51,
        rating: 4.6,
        availability: 'Available in 3 weeks',
        avatar: 'person1.jpg',
        category: 'Engineering and Architecture'
      },
      {
        id: 5,
        name: 'Alexandra Park',
        title: 'DevOps Engineer',
        yearsOfExperience: 7,
        employer: 'CloudSystems Inc.',
        occupation: 'IT Infrastructure',
        location: 'London',
        education: 'B.S. Computer Engineering',
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'AWS'],
        projectCount: 41,
        rating: 4.8,
        availability: 'Immediately Available',
        avatar: 'person.jpg',
        category: 'Information Technology and Mathematics'
      }
    ];
    
    return mockData;
  }
}