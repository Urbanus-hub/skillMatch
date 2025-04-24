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
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule]
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

  constructor() {}

  ngOnInit(): void {
    this.loadCandidates();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filterCandidates();
    });
  }

  loadCandidates(): void {
    setTimeout(() => {
      this.candidates = [
        {
          id: 1,
          name: 'Alex Johnson',
          photo: 'https://i.pravatar.cc/300?img=11',
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
          photo: 'https://i.pravatar.cc/300?img=5',
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
          photo: 'https://i.pravatar.cc/300?img=13',
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
          photo: 'https://i.pravatar.cc/300?img=23',
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
          photo: 'https://i.pravatar.cc/300?img=53', 
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
          photo: 'https://i.pravatar.cc/300?img=47',
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
      const matchesSearch = searchTerm === '' ||
        candidate.name.toLowerCase().includes(searchTerm) ||
        candidate.title.toLowerCase().includes(searchTerm) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm));

      const matchesSkills = this.skillFilters.length === 0 ||
        this.skillFilters.every(skill => candidate.skills.includes(skill));

      const matchesLocation = this.selectedLocation === 'All Locations' ||
        candidate.location === this.selectedLocation;

      return matchesSearch && matchesSkills && matchesLocation;
    });

    this.sortCandidates();
  }

  sortCandidates(): void {
    switch (this.sortBy) {
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
      default:
        break;
    }
  }

  saveCandidate(candidateId: number): void {
    console.log('Saving candidate to favorites:', candidateId);
    // Save logic
  }

  contactCandidate(candidateId: number): void {
    console.log('Contacting candidate:', candidateId);
    // Contact logic
  }
}