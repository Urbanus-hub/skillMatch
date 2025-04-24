// talent-pool.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Candidate {
  id: number;
  name: string;
  photo: string;
  title: string;
  skills: string[];
  experience: number;
  location: string;
  availability: string;
  rating: number;
  salary: string;
  lastActive: string;
}

@Component({
  selector: 'app-talent-pool',
  templateUrl: './ai-pool.component.html',
  styleUrls: ['./ai-pool.component.css'],
  imports:[FormsModule,CommonModule,ReactiveFormsModule]
})
export class AiPoolComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  searchControl = new FormControl('');
  skillFilters: string[] = [];
  availableSkills: string[] = ['Angular', 'React', 'Vue', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C#', 'UI/UX', 'Product Management', 'DevOps'];
  selectedLocation: string = 'All Locations';
  locations: string[] = ['All Locations', 'Remote', 'New York', 'San Francisco', 'London', 'Berlin', 'Singapore', 'Tokyo'];
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'relevance';
  isLoading: boolean = true;
  
  constructor() { }

  ngOnInit(): void {
    this.loadCandidates();
    
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterCandidates();
    });
  }
  
getCandidatePhotoUrl(candidate: any): string {
  // Use a different avatar style based on candidate ID to get some variety
  const avatarStyle = candidate.id % 4;
  
  switch(avatarStyle) {
    case 0:
      // Professional photo-like avatars
      return `https://i.pravatar.cc/150?img=${candidate.id % 70}`; 
    case 1:
      // Initials-based avatars
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&size=150`;
    case 2:
      // Identicon style
      return `https://avatars.dicebear.com/api/identicon/${candidate.id}.svg`;
    case 3:
      // Robot avatars
      return `https://robohash.org/${candidate.id}?size=150x150&set=set3`;
    default:
      return `https://i.pravatar.cc/150?img=${candidate.id % 70}`;
  }
}

  loadCandidates(): void {
    // Simulate API call with timeout
    setTimeout(() => {
      this.candidates = [
        {
          id: 1,
          name: 'Alex Johnson',
          photo: 'assets/avatars/avatar1.jpg',
          title: 'Senior Frontend Developer',
          skills: ['Angular', 'TypeScript', 'React', 'CSS'],
          experience: 6,
          location: 'Remote',
          availability: 'Immediate',
          rating: 4.8,
          salary: '$110k - $130k',
          lastActive: '2 days ago'
        },
        {
          id: 2,
          name: 'Sarah Williams',
          photo: 'assets/avatars/avatar2.jpg',
          title: 'Full Stack Developer',
          skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
          experience: 4,
          location: 'New York',
          availability: '2 weeks',
          rating: 4.5,
          salary: '$95k - $115k',
          lastActive: 'Today'
        },
        {
          id: 3,
          name: 'Miguel Rodriguez',
          photo: 'assets/avatars/avatar3.jpg',
          title: 'UX/UI Designer',
          skills: ['UI/UX', 'Figma', 'Sketch', 'Adobe XD'],
          experience: 5,
          location: 'San Francisco',
          availability: '1 month',
          rating: 4.9,
          salary: '$105k - $125k',
          lastActive: 'Yesterday'
        },
        {
          id: 4,
          name: 'Priya Patel',
          photo: 'assets/avatars/avatar4.jpg',
          title: 'DevOps Engineer',
          skills: ['DevOps', 'Kubernetes', 'Docker', 'CI/CD'],
          experience: 3,
          location: 'Remote',
          availability: 'Immediate',
          rating: 4.7,
          salary: '$100k - $120k',
          lastActive: '3 days ago'
        },
        {
          id: 5,
          name: 'David Kim',
          photo: 'assets/avatars/avatar5.jpg',
          title: 'Product Manager',
          skills: ['Product Management', 'Agile', 'Roadmapping', 'User Research'],
          experience: 7,
          location: 'London',
          availability: '2 months',
          rating: 4.6,
          salary: '$120k - $140k',
          lastActive: '1 week ago'
        },
        {
          id: 6,
          name: 'Lisa Chen',
          photo: 'assets/avatars/avatar6.jpg',
          title: 'Backend Developer',
          skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
          experience: 5,
          location: 'Berlin',
          availability: '3 weeks',
          rating: 4.4,
          salary: '$90k - $110k',
          lastActive: 'Today'
        }
      ];
      
      this.filteredCandidates = [...this.candidates];
      this.isLoading = false;
    }, 800);
  }
  
  toggleSkillFilter(skill: string): void {
    const index = this.skillFilters.indexOf(skill);
    if (index >= 0) {
      this.skillFilters.splice(index, 1);
    } else {
      this.skillFilters.push(skill);
    }
    this.filterCandidates();
  }
  
  setLocation(location: string): void {
    this.selectedLocation = location;
    this.filterCandidates();
  }
  
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
  
  setSortBy(criteria: string): void {
    this.sortBy = criteria;
    this.sortCandidates();
  }
  
  filterCandidates(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    
    this.filteredCandidates = this.candidates.filter(candidate => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        candidate.name.toLowerCase().includes(searchTerm) || 
        candidate.title.toLowerCase().includes(searchTerm) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm));
      
      // Filter by skills
      const matchesSkills = this.skillFilters.length === 0 || 
        this.skillFilters.every(skill => candidate.skills.includes(skill));
      
      // Filter by location
      const matchesLocation = this.selectedLocation === 'All Locations' || 
        candidate.location === this.selectedLocation;
      
      return matchesSearch && matchesSkills && matchesLocation;
    });
    
    this.sortCandidates();
  }
  
  sortCandidates(): void {
    switch(this.sortBy) {
      case 'rating':
        this.filteredCandidates.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        this.filteredCandidates.sort((a, b) => b.experience - a.experience);
        break;
      case 'availability':
        this.filteredCandidates.sort((a, b) => {
          if (a.availability === 'Immediate') return -1;
          if (b.availability === 'Immediate') return 1;
          return a.availability.localeCompare(b.availability);
        });
        break;
      case 'recent':
        this.filteredCandidates.sort((a, b) => {
          if (a.lastActive === 'Today') return -1;
          if (b.lastActive === 'Today') return 1;
          if (a.lastActive === 'Yesterday') return -1;
          if (b.lastActive === 'Yesterday') return 1;
          return a.lastActive.localeCompare(b.lastActive);
        });
        break;
      default: // relevance or default
        // Keep original order which is presumed to be by relevance
        break;
    }
  }
  
  saveCandidate(candidateId: number): void {
    console.log('Saving candidate to favorites:', candidateId);
    // Implementation for saving to favorites would go here
  }
  
  contactCandidate(candidateId: number): void {
    console.log('Contacting candidate:', candidateId);
    // Implementation for contacting would go here
  }
}