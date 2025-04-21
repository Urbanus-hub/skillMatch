import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css'],
  providers: [HttpClientModule],
  imports: [CommonModule, FormsModule]
})
export class LearningComponent implements OnInit {
  // Filter and search properties
  searchQuery: string = '';
  filters = {
    category: 'all',
    status: 'all'
  };
  availableTags: string[] = ['Programming', 'Data Science', 'Web Development', 'Design', 'Marketing', 'Business', 'AI', 'Mobile', 'DevOps'];
  selectedTags: string[] = [];
  
  // Resource management
  resources: LearningResource[] = [];
  filteredResources: LearningResource[] = [];
  selectedResource: LearningResource | null = null;
  
  // Modal controls
  isAddingResource: boolean = false;
  isUpdatingProgress: boolean = false;
  isEditingNote: boolean = false;
  progressValue: number = 0;
  editingNoteIndex: number = -1;
  currentNoteContent: string = '';
  
  // New resource form
  newResource: LearningResource = this.getEmptyResource();
  tagInput: string = '';

  constructor() { }

  ngOnInit(): void {
    // Load resources from storage or API
    this.loadResources();
    this.applyFilters();
  }

  // Filter methods
  applyFilters(): void {
    this.filteredResources = this.resources.filter(resource => {
      // Apply search filter
      const matchesSearch = this.searchQuery === '' || 
        resource.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        resource.provider.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Apply category filter
      const matchesCategory = this.filters.category === 'all' || 
        resource.category === this.filters.category;
      
      // Apply status filter
      const matchesStatus = this.filters.status === 'all' || 
        resource.status === this.filters.status;
      
      // Apply tags filter
      const matchesTags = this.selectedTags.length === 0 || 
        this.selectedTags.every(tag => resource.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesStatus && matchesTags;
    });
  }

  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.applyFilters();
  }

  // Resource selection and management
  selectResource(id: number): void {
    const resource = this.resources.find(r => r.id === id);
    this.selectedResource = resource || null;
  }

  openAddResourceModal(): void {
    this.newResource = this.getEmptyResource();
    this.isAddingResource = true;
  }

  closeAddResourceModal(): void {
    this.isAddingResource = false;
  }

  saveNewResource(): void {
    // Validate required fields
    if (!this.newResource.title || !this.newResource.provider || !this.newResource.category) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate a new ID
    const newId = Math.max(0, ...this.resources.map(r => r.id)) + 1;
    
    // Set additional properties
    const newResourceWithId: LearningResource = {
      ...this.newResource,
      id: newId,
      status: 'notStarted',
      progress: 0,
      dateAdded: new Date()
    };
    
    // Add to resources array
    this.resources.push(newResourceWithId);
    
    // Apply filters and select the new resource
    this.applyFilters();
    this.selectResource(newId);
    
    // Close the modal
    this.closeAddResourceModal();
    
    // Save to storage
    this.saveResources();
  }

  openEditResourceModal(): void {
    if (!this.selectedResource) return;
    
    // Clone the selected resource for editing
    this.newResource = { ...this.selectedResource };
    this.isAddingResource = true;
  }

  deleteResource(resource: LearningResource): void {
    if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
      const index = this.resources.findIndex(r => r.id === resource.id);
      if (index !== -1) {
        this.resources.splice(index, 1);
        this.selectedResource = null;
        this.applyFilters();
        this.saveResources();
      }
    }
  }

  // Progress handling
  updateProgress(): void {
    if (!this.selectedResource) return;
    
    this.progressValue = this.selectedResource.progress;
    this.isUpdatingProgress = true;
  }

  closeUpdateProgressModal(): void {
    this.isUpdatingProgress = false;
  }

  saveProgress(): void {
    if (!this.selectedResource) return;
    
    this.selectedResource.progress = this.progressValue;
    
    // If progress is 100%, mark as completed
    if (this.progressValue === 100) {
      this.selectedResource.status = 'completed';
      this.selectedResource.completedDate = new Date();
    } else {
      this.selectedResource.status = 'inProgress';
    }
    
    this.closeUpdateProgressModal();
    this.saveResources();
  }

  startResource(resource: LearningResource): void {
    resource.status = 'inProgress';
    resource.progress = 0;
    this.saveResources();
  }

  toggleResourceStatus(resource: LearningResource): void {
    if (resource.status === 'completed') {
      resource.status = 'inProgress';
    } else {
      resource.status = 'completed';
      resource.progress = 100;
      resource.completedDate = new Date();
    }
    this.saveResources();
  }

  // Note handling
  addNote(): void {
    this.currentNoteContent = '';
    this.editingNoteIndex = -1;
    this.isEditingNote = true;
  }

  editNote(index: number): void {
    if (!this.selectedResource || !this.selectedResource.notes) return;
    
    this.currentNoteContent = this.selectedResource.notes[index].content;
    this.editingNoteIndex = index;
    this.isEditingNote = true;
  }

  closeNoteModal(): void {
    this.isEditingNote = false;
  }

  saveNote(): void {
    if (!this.selectedResource) return;
    
    // Ensure notes array exists
    if (!this.selectedResource.notes) {
      this.selectedResource.notes = [];
    }
    
    if (this.editingNoteIndex === -1) {
      // Add new note
      this.selectedResource.notes.push({
        content: this.currentNoteContent,
        date: new Date()
      });
    } else {
      // Update existing note
      this.selectedResource.notes[this.editingNoteIndex].content = this.currentNoteContent;
      this.selectedResource.notes[this.editingNoteIndex].date = new Date();
    }
    
    this.closeNoteModal();
    this.saveResources();
  }

  deleteNote(index: number): void {
    if (!this.selectedResource || !this.selectedResource.notes) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      this.selectedResource.notes.splice(index, 1);
      this.saveResources();
    }
  }

  // Content structure handling
  toggleChapter(index: number): void {
    if (!this.selectedResource || !this.selectedResource.contents) return;
    
    this.selectedResource.contents[index].expanded = !this.selectedResource.contents[index].expanded;
  }

  toggleSectionComplete(chapterIndex: number, sectionIndex: number): void {
    if (!this.selectedResource || !this.selectedResource.contents) return;
    
    const chapter = this.selectedResource.contents[chapterIndex];
    const section = chapter.sections[sectionIndex];
    
    section.completed = !section.completed;
    
    // Check if all sections are completed to mark chapter as completed
    chapter.completed = chapter.sections.every(s => s.completed);
    
    // Update progress based on completed sections
    this.updateResourceProgress();
    this.saveResources();
  }

  updateResourceProgress(): void {
    if (!this.selectedResource || !this.selectedResource.contents) return;
    
    const totalSections = this.selectedResource.contents.reduce(
      (total, chapter) => total + chapter.sections.length, 0);
    
    const completedSections = this.selectedResource.contents.reduce(
      (total, chapter) => total + chapter.sections.filter(s => s.completed).length, 0);
    
    if (totalSections > 0) {
      this.selectedResource.progress = Math.round((completedSections / totalSections) * 100);
      
      if (this.selectedResource.progress === 100) {
        this.selectedResource.status = 'completed';
        this.selectedResource.completedDate = new Date();
      } else if (this.selectedResource.progress > 0) {
        this.selectedResource.status = 'inProgress';
      }
    }
  }

  // Tag handling
  addTag(event: Event): void {
    event.preventDefault();
    
    if (this.tagInput.trim() !== '' && !this.newResource.tags.includes(this.tagInput.trim())) {
      this.newResource.tags.push(this.tagInput.trim());
      this.tagInput = '';
    }
  }

  removeTag(index: number): void {
    this.newResource.tags.splice(index, 1);
  }

  // Helper methods
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'courses': return 'fa-graduation-cap';
      case 'books': return 'fa-book';
      case 'videos': return 'fa-video';
      case 'articles': return 'fa-file-alt';
      default: return 'fa-bookmark';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'notStarted': return 'Not Started';
      case 'inProgress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'notStarted': return 'not-started';
      case 'inProgress': return 'in-progress';
      case 'completed': return 'completed';
      default: return '';
    }
  }

  getActionIcon(category: string): string {
    switch (category) {
      case 'courses': return 'fa-play-circle';
      case 'books': return 'fa-book-open';
      case 'videos': return 'fa-play';
      case 'articles': return 'fa-external-link-alt';
      default: return 'fa-external-link-alt';
    }
  }

  getActionText(category: string): string {
    switch (category) {
      case 'courses': return 'Start Course';
      case 'books': return 'Read Book';
      case 'videos': return 'Watch Video';
      case 'articles': return 'Read Article';
      default: return 'Open Resource';
    }
  }

  getResourceTypeIcon(type: string): string {
    switch (type) {
      case 'pdf': return 'fa-file-pdf';
      case 'document': return 'fa-file-alt';
      case 'video': return 'fa-video';
      case 'website': return 'fa-globe';
      case 'code': return 'fa-code';
      default: return 'fa-link';
    }
  }

  // Storage methods
  private loadResources(): void {
    const savedResources = localStorage.getItem('learningResources');
    if (savedResources) {
      try {
        const parsedResources = JSON.parse(savedResources);
        
        // Convert date strings back to Date objects
        this.resources = parsedResources.map((r: any) => ({
          ...r, 
          dateAdded: new Date(r.dateAdded),
          completedDate: r.completedDate ? new Date(r.completedDate) : undefined,
          notes: r.notes ? r.notes.map((n: any) => ({
            ...n,
            date: new Date(n.date)
          })) : []
        }));
      } catch (e) {
        console.error('Error loading resources:', e);
        this.resources = this.getSampleResources();
      }
    } else {
      // Load sample data for first time users
      this.resources = this.getSampleResources();
    }
  }

  private saveResources(): void {
    localStorage.setItem('learningResources', JSON.stringify(this.resources));
  }

  private getEmptyResource(): LearningResource {
    return {
      id: 0,
      title: '',
      provider: '',
      category: 'courses',
      url: '',
      status: 'notStarted',
      progress: 0,
      dateAdded: new Date(),
      tags: [],
      description: '',
      author: '',
      duration: 0,
      language: 'English',
      level: 'beginner',
      notes: []
    };
  }

  private getSampleResources(): LearningResource[] {
    return [
      {
        id: 1,
        title: 'Angular Complete Guide',
        provider: 'Udemy',
        category: 'courses',
        url: 'https://www.udemy.com/course/angular-complete-guide',
        status: 'inProgress',
        progress: 65,
        dateAdded: new Date('2023-01-15'),
        tags: ['Programming', 'Web Development', 'Angular'],
        description: 'Master Angular 13 and build awesome, reactive web apps with the successor of Angular.js',
        author: 'Maximilian Schwarzmüller',
        duration: 2100, // 35 hours
        language: 'English',
        level: 'intermediate',
        notes: [
          {
            content: 'Remember to check out the section on RxJS observables - very important for HTTP requests!',
            date: new Date('2023-01-20')
          },
          {
            content: 'The Angular routing module is complex but powerful. Make sure to understand guards and resolvers.',
            date: new Date('2023-02-10')
          }
        ],
        contents: [
          {
            title: 'Getting Started',
            expanded: true,
            completed: true,
            sections: [
              { title: 'Course Introduction', duration: 10, completed: true },
              { title: 'What is Angular?', duration: 15, completed: true },
              { title: 'Angular vs Angular.js', duration: 8, completed: true },
              { title: 'Project Setup', duration: 20, completed: true }
            ]
          },
          {
            title: 'The Basics',
            expanded: false,
            completed: true,
            sections: [
              { title: 'Components', duration: 25, completed: true },
              { title: 'Data Binding', duration: 30, completed: true },
              { title: 'Directives', duration: 20, completed: true }
            ]
          },
          {
            title: 'Components & Databinding',
            expanded: false,
            completed: false,
            sections: [
              { title: 'Property & Event Binding', duration: 25, completed: true },
              { title: 'View Encapsulation', duration: 15, completed: true },
              { title: 'Local References', duration: 10, completed: false },
              { title: 'Content Projection', duration: 20, completed: false }
            ]
          },
          {
            title: 'Services & Dependency Injection',
            expanded: false,
            completed: false,
            sections: [
              { title: 'Why Services?', duration: 15, completed: false },
              { title: 'Creating Services', duration: 20, completed: false },
              { title: 'Hierarchical Injector', duration: 25, completed: false }
            ]
          }
        ],
        resources: [
          {
            name: 'Angular Documentation',
            description: 'Official Angular documentation',
            url: 'https://angular.io/docs',
            type: 'website'
          },
          {
            name: 'Course Resources',
            description: 'Downloadable resources for the course',
            url: 'https://example.com/resources',
            type: 'pdf'
          }
        ]
      },
      {
        id: 2,
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        provider: 'Amazon',
        category: 'books',
        url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
        status: 'notStarted',
        progress: 0,
        dateAdded: new Date('2023-03-10'),
        tags: ['Programming', 'Software Engineering', 'Best Practices'],
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code.",
        author: 'Robert C. Martin',
        duration: 960, // Approx. reading time in minutes
        language: 'English',
        level: 'intermediate',
        notes: []
      },
      {
        id: 3,
        title: 'Introduction to Machine Learning',
        provider: 'Coursera',
        category: 'courses',
        url: 'https://www.coursera.org/learn/machine-learning',
        status: 'completed',
        progress: 100,
        dateAdded: new Date('2022-11-05'),
        completedDate: new Date('2023-01-20'),
        tags: ['AI', 'Data Science', 'Machine Learning'],
        description: 'This course provides a broad introduction to machine learning, datamining, and statistical pattern recognition.',
        author: 'Andrew Ng',
        duration: 3600, // 60 hours
        language: 'English',
        level: 'beginner',
        rating: 5,
        certificate: 'https://example.com/certificate/123456',
        notes: [
          {
            content: 'The linear regression and gradient descent explanations were incredibly clear!',
            date: new Date('2022-12-01')
          },
          {
            content: 'Neural networks section was challenging but rewarding. Revisit the backpropagation algorithm.',
            date: new Date('2022-12-15')
          }
        ]
      },
      {
        id: 4,
        title: 'Understanding TypeScript',
        provider: 'Udemy',
        category: 'courses',
        url: 'https://www.udemy.com/course/understanding-typescript',
        status: 'inProgress',
        progress: 30,
        dateAdded: new Date('2023-02-20'),
        tags: ['Programming', 'TypeScript', 'Web Development'],
        description: 'Learn how to use TypeScript effectively with this comprehensive course',
        author: 'Maximilian Schwarzmüller',
        duration: 930, // 15.5 hours
        language: 'English',
        level: 'intermediate',
        notes: [
          {
            content: 'The section on generics was particularly useful for my current project',
            date: new Date('2023-03-05')
          }
        ]
      },
      {
        id: 5,
        title: 'CSS Grid: The Ultimate Guide',
        provider: 'YouTube',
        category: 'videos',
        url: 'https://www.youtube.com/watch?v=example',
        status: 'notStarted',
        progress: 0,
        dateAdded: new Date('2023-03-15'),
        tags: ['Web Development', 'CSS', 'Design'],
        description: 'A comprehensive guide to CSS Grid layout',
        author: 'Kevin Powell',
        duration: 75, // 1.25 hours
        language: 'English',
        level: 'all',
        notes: []
      }
    ];
  }
}

// Interfaces
interface LearningResource {
  id: number;
  title: string;
  provider: string;
  category: string;
  url: string;
  status: 'notStarted' | 'inProgress' | 'completed';
  progress: number;
  dateAdded: Date;
  completedDate?: Date;
  tags: string[];
  description?: string;
  author?: string;
  duration?: number;
  language?: string;
  level?: string;
  rating?: number;
  certificate?: string;
  notes?: Note[];
  contents?: Chapter[];
  resources?: AdditionalResource[];
}

interface Note {
  content: string;
  date: Date;
}

interface Chapter {
  title: string;
  expanded: boolean;
  completed: boolean;
  sections: Section[];
}

interface Section {
  title: string;
  duration?: number;
  completed: boolean;
}

interface AdditionalResource {
  name: string;
  description: string;
  url: string;
  type: string;
}