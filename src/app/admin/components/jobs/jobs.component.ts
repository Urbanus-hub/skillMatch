import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
  // Status counts
  pendingCount = 8;
  approvedCount = 15;
  rejectedCount = 3;
  
  // Loading state
  isLoading = false;
  
  // Search and sort
  searchQuery = '';
  currentSort = 'Date (Newest)';
  showSortMenu = false;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalJobs = 0;
  paginationStart = 1;
  paginationEnd = 5;
  totalPages = 1;
  pageNumbers: number[] = [1, 2, 3];
  
  // Filter states
  jobStatusCounts: JobStatusCount[] = [
    { status: 'All Jobs', count: 26, active: false },
    { status: 'Pending Review', count: 8, active: true },
    { status: 'Approved', count: 15, active: false },
    { status: 'Rejected', count: 3, active: false }
  ];
  
  jobCategories: CategoryFilter[] = [
    { name: 'Software Development', count: 10, active: false },
    { name: 'Design', count: 6, active: false },
    { name: 'Marketing', count: 5, active: false },
    { name: 'Sales', count: 3, active: false },
    { name: 'Customer Support', count: 2, active: false }
  ];
  
  experienceLevels: ExperienceFilter[] = [
    { name: 'Entry Level', count: 8, active: false },
    { name: 'Mid Level', count: 12, active: false },
    { name: 'Senior Level', count: 4, active: false },
    { name: 'Executive', count: 2, active: false }
  ];
  
  // Job listings
  jobs: Job[] = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'Pending',
      location: 'New York, NY',
      type: 'Full-time',
      category: 'Software Development',
      experience: 'Mid Level',
      datePosted: new Date('2025-04-10'),
      description: 'We are seeking a talented Frontend Developer to join our team. The ideal candidate will have experience with Angular, React, or Vue.js and a strong understanding of modern web development practices.'
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Design Solutions',
      status: 'Pending',
      location: 'San Francisco, CA',
      type: 'Full-time',
      category: 'Design',
      experience: 'Senior Level',
      datePosted: new Date('2025-04-08'),
      description: 'Looking for an experienced UX Designer to create intuitive user experiences for our clients. Must be proficient in user research, wireframing, and prototyping.'
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      company: 'GrowthHub',
      status: 'Approved',
      location: 'Remote',
      type: 'Contract',
      category: 'Marketing',
      experience: 'Entry Level',
      datePosted: new Date('2025-04-05'),
      description: 'Join our marketing team to help develop and implement marketing strategies for our growing client base. Experience with digital marketing and analytics preferred.'
    },
    {
      id: 4,
      title: 'Backend Engineer',
      company: 'ServerStack',
      status: 'Rejected',
      location: 'Austin, TX',
      type: 'Full-time',
      category: 'Software Development',
      experience: 'Mid Level',
      datePosted: new Date('2025-04-02'),
      description: 'Backend Engineer with strong Node.js and database experience needed for our cloud infrastructure team. Must have experience with serverless architectures and API development.'
    }
  ];
  
  filteredJobs: Job[] = [];
  
  constructor() { }
  
  ngOnInit(): void {
    this.filteredJobs = this.filterJobs();
    this.updatePagination();
  }
  
  // Filter functions
  setActiveFilter(status: string): void {
    this.jobStatusCounts.forEach(item => {
      item.active = item.status === status;
    });
    this.updateJobs();
  }
  
  setActiveCategory(category: string): void {
    this.jobCategories.forEach(item => {
      item.active = item.name === category;
    });
    this.updateJobs();
  }
  
  setActiveExperience(level: string): void {
    this.experienceLevels.forEach(item => {
      item.active = item.name === level;
    });
    this.updateJobs();
  }
  
  clearAllFilters(): void {
    this.jobStatusCounts.forEach(item => item.active = item.status === 'All Jobs');
    this.jobCategories.forEach(item => item.active = false);
    this.experienceLevels.forEach(item => item.active = false);
    this.searchQuery = '';
    this.updateJobs();
  }
  
  // Search function
  searchJobs(): void {
    this.updateJobs();
  }
  
  // Sort functions
  toggleSortMenu(): void {
    this.showSortMenu = !this.showSortMenu;
  }
  
  setSort(sortOption: string): void {
    this.currentSort = sortOption;
    this.showSortMenu = false;
    this.updateJobs();
  }
  
  // Pagination functions
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }
  
  updatePagination(): void {
    this.totalJobs = this.filteredJobs.length;
    this.totalPages = Math.ceil(this.totalJobs / this.itemsPerPage);
    
    this.paginationStart = ((this.currentPage - 1) * this.itemsPerPage) + 1;
    this.paginationEnd = Math.min(this.currentPage * this.itemsPerPage, this.totalJobs);
    
    // Generate page numbers (show max 5 pages)
    this.pageNumbers = [];
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        this.pageNumbers = [1, 2, 3, 4, 5];
      } else if (this.currentPage >= this.totalPages - 2) {
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          this.pageNumbers.push(i);
        }
      } else {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          this.pageNumbers.push(i);
        }
      }
    }
    
    // Update displayed jobs based on pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredJobs = this.filterJobs().slice(startIndex, endIndex);
  }
  
  // Helper functions
  filterJobs(): Job[] {
    let result = [...this.jobs];
    
    // Filter by status
    const activeStatus = this.jobStatusCounts.find(s => s.active)?.status;
    if (activeStatus && activeStatus !== 'All Jobs') {
      const statusMap: Record<string, string> = {
        'Pending Review': 'Pending',
        'Approved': 'Approved',
        'Rejected': 'Rejected'
      };
      result = result.filter(job => job.status === statusMap[activeStatus]);
    }
    
    // Filter by category
    const activeCategory = this.jobCategories.find(c => c.active)?.name;
    if (activeCategory) {
      result = result.filter(job => job.category === activeCategory);
    }
    
    // Filter by experience
    const activeExperience = this.experienceLevels.find(e => e.active)?.name;
    if (activeExperience) {
      result = result.filter(job => job.experience === activeExperience);
    }
    
    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query)
      );
    }
    
    // Sort jobs
    result = this.sortJobs(result);
    
    return result;
  }
  
  sortJobs(jobs: Job[]): Job[] {
    switch (this.currentSort) {
      case 'Date (Newest)':
        return [...jobs].sort((a, b) => b.datePosted.getTime() - a.datePosted.getTime());
      case 'Date (Oldest)':
        return [...jobs].sort((a, b) => a.datePosted.getTime() - b.datePosted.getTime());
      case 'Company (A-Z)':
        return [...jobs].sort((a, b) => a.company.localeCompare(b.company));
      case 'Job Title (A-Z)':
        return [...jobs].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return jobs;
    }
  }
  
  updateJobs(): void {
    this.isLoading = true;
    
    // Simulate loading time
    setTimeout(() => {
      this.currentPage = 1;
      this.filteredJobs = this.filterJobs();
      this.updatePagination();
      this.isLoading = false;
    }, 500);
  }
  
  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending':
      case 'Pending Review':
        return 'fa-clock-o';
      case 'Approved':
        return 'fa-check-circle';
      case 'Rejected':
        return 'fa-times-circle';
      default:
        return 'fa-list';
    }
  }
  
  // Job actions
  approveJob(jobId: number): void {
    const jobIndex = this.jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      this.jobs[jobIndex].status = 'Approved';
      this.pendingCount--;
      this.approvedCount++;
      this.updateJobStatusCounts();
      this.updateJobs();
    }
  }
  
  rejectJob(jobId: number): void {
    const jobIndex = this.jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      this.jobs[jobIndex].status = 'Rejected';
      this.pendingCount--;
      this.rejectedCount++;
      this.updateJobStatusCounts();
      this.updateJobs();
    }
  }
  
  updateJobStatusCounts(): void {
    this.jobStatusCounts = [
      { status: 'All Jobs', count: this.jobs.length, active: this.jobStatusCounts[0].active },
      { status: 'Pending Review', count: this.pendingCount, active: this.jobStatusCounts[1].active },
      { status: 'Approved', count: this.approvedCount, active: this.jobStatusCounts[2].active },
      { status: 'Rejected', count: this.rejectedCount, active: this.jobStatusCounts[3].active }
    ];
  }
}

interface JobStatusCount {
  status: string;
  count: number;
  active?: boolean;
}

interface CategoryFilter {
  name: string;
  count: number;
  active?: boolean;
}

interface ExperienceFilter {
  name: string;
  count: number;
  active?: boolean;
}

interface Job {
  id: number;
  title: string;
  company: string;
  status: string;
  location: string;
  type: string;
  category: string;
  experience: string;
  datePosted: Date;
  description: string;
}