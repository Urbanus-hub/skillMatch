import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Company {
  id: number;
  logo: string;
  name: string;
  industry: string;
  location: string;
  employees: string;
  openPositions: number;
  totalHires: number;
  avgTimeToHire: string;
  // Additional properties for enhanced features
  established?: number;
  brandColor?: string;
  growth?: number;
  priority?: boolean;
}

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [
    {
      id: 1,
      logo: '64 × 64',
      name: 'CloudNine',
      industry: 'Cloud Computing',
      location: 'Seattle, WA',
      employees: '5000+',
      openPositions: 42,
      totalHires: 278,
      avgTimeToHire: '20 days',
      established: 2008,
      brandColor: '#3498db',
      growth: 12,
      priority: true
    },
    {
      id: 2,
      logo: '64 × 64',
      name: 'TechCorp',
      industry: 'Technology',
      location: 'San Francisco, CA',
      employees: '1000-5000',
      openPositions: 24,
      totalHires: 156,
      avgTimeToHire: '18 days',
      established: 2012,
      brandColor: '#2ecc71',
      growth: 8,
      priority: false
    },
    {
      id: 3,
      logo: '64 × 64',
      name: 'DataSphere',
      industry: 'Data Analytics',
      location: 'Boston, MA',
      employees: '1000-5000',
      openPositions: 19,
      totalHires: 134,
      avgTimeToHire: '23 days',
      established: 2015,
      brandColor: '#9b59b6',
      growth: 5,
      priority: false
    },
    {
      id: 4,
      logo: '64 × 64',
      name: 'InnovateCo',
      industry: 'Software',
      location: 'New York, NY',
      employees: '500-1000',
      openPositions: 15,
      totalHires: 89,
      avgTimeToHire: '21 days',
      established: 2017,
      brandColor: '#e74c3c',
      growth: -2,
      priority: true
    },
    {
      id: 5,
      logo: '64 × 64',
      name: 'DesignHub',
      industry: 'Design',
      location: 'Remote',
      employees: '100-500',
      openPositions: 8,
      totalHires: 45,
      avgTimeToHire: '15 days',
      established: 2020,
      brandColor: '#1abc9c',
      growth: 15,
      priority: false
    }
  ];

  filteredCompanies: Company[] = [];
  
  // Filters
  searchTerm: string = '';
  industryFilter: string = '';
  locationFilter: string = '';
  sizeFilter: string = '';
  
  // Sorting
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  startItem: number = 0;
  endItem: number = 0;
  
  // Lists for filters
  industries: string[] = [];
  locations: string[] = [];
  
  // Stats
  totalCompanies: number = 0;
  totalOpenPositions: number = 0;
  avgTimeToHire: number = 0;
  totalHires: number = 0;
  
  constructor() { }

  ngOnInit(): void {
    this.extractFilterOptions();
    this.calculateStats();
    this.filterCompanies();
  }

  extractFilterOptions(): void {
    // Extract unique industries and locations for filters
    this.industries = [...new Set(this.companies.map(company => company.industry))];
    this.locations = [...new Set(this.companies.map(company => company.location))];
  }

  calculateStats(): void {
    this.totalCompanies = this.companies.length;
    this.totalOpenPositions = this.companies.reduce((sum, company) => sum + company.openPositions, 0);
    this.totalHires = this.companies.reduce((sum, company) => sum + company.totalHires, 0);
    
    // Calculate average time to hire (extract number from string like "20 days")
    const avgDays = this.companies.map(company => 
      parseInt(company.avgTimeToHire.split(' ')[0])
    );
    this.avgTimeToHire = Math.round(avgDays.reduce((sum, days) => sum + days, 0) / avgDays.length);
  }

  filterCompanies(): void {
    let filtered = [...this.companies];
    
    // Apply search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(term) || 
        company.industry.toLowerCase().includes(term) ||
        company.location.toLowerCase().includes(term)
      );
    }
    
    // Apply industry filter
    if (this.industryFilter) {
      filtered = filtered.filter(company => company.industry === this.industryFilter);
    }
    
    // Apply location filter
    if (this.locationFilter) {
      filtered = filtered.filter(company => company.location === this.locationFilter);
    }
    
    // Apply size filter
    if (this.sizeFilter) {
      filtered = filtered.filter(company => {
        if (this.sizeFilter === 'small' && company.employees.includes('100-500')) return true;
        if (this.sizeFilter === 'medium' && company.employees.includes('500-1000')) return true;
        if (this.sizeFilter === 'large' && 
            (company.employees.includes('1000-5000') || company.employees.includes('5000+'))) return true;
        return false;
      });
    }
    
    // Apply sorting
    filtered = this.sortCompanies(filtered);
    
    this.totalItems = filtered.length;
    this.updatePagination();
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.startItem = this.totalItems > 0 ? startIndex + 1 : 0;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.endItem = endIndex;
    
    this.filteredCompanies = filtered.slice(startIndex, endIndex);
  }

  sortCompanies(companies: Company[]): Company[] {
    return companies.sort((a, b) => {
      let comparison = 0;
      
      // Handle numeric and string comparisons
      if (this.sortColumn === 'openPositions' || this.sortColumn === 'totalHires') {
        comparison = a[this.sortColumn] - b[this.sortColumn];
      } else if (this.sortColumn === 'avgTimeToHire') {
        const daysA = parseInt(a.avgTimeToHire.split(' ')[0]);
        const daysB = parseInt(b.avgTimeToHire.split(' ')[0]);
        comparison = daysA - daysB;
      } else {
        // String comparison
        const valueA = String(a[this.sortColumn as keyof Company]).toLowerCase();
        const valueB = String(b[this.sortColumn as keyof Company]).toLowerCase();
        comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      }
      
      // Reverse for descending order
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      // Toggle direction if already sorting by this column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending for new column
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.filterCompanies();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Create an array of page numbers for pagination display
    this.pageNumbers = [];
    if (this.totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= this.totalPages; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      // Show first, last, and pages around current
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          this.pageNumbers.push(i);
        }
        this.pageNumbers.push(0); // ellipsis placeholder
        this.pageNumbers.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        this.pageNumbers.push(1);
        this.pageNumbers.push(0); // ellipsis placeholder
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          this.pageNumbers.push(i);
        }
      } else {
        this.pageNumbers.push(1);
        this.pageNumbers.push(0); // ellipsis placeholder
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          this.pageNumbers.push(i);
        }
        this.pageNumbers.push(0); // ellipsis placeholder
        this.pageNumbers.push(this.totalPages);
      }
    }
    
    // Ensure current page is within valid range
    if (this.currentPage > this.totalPages) {
      this.goToPage(this.totalPages);
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.filterCompanies();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.industryFilter = '';
    this.locationFilter = '';
    this.sizeFilter = '';
    this.currentPage = 1;
    this.filterCompanies();
  }

  get isFiltered(): boolean {
    return !!(this.searchTerm || this.industryFilter || this.locationFilter || this.sizeFilter);
  }

  getPositionsPercentage(positions: number): number {
    const max = Math.max(...this.companies.map(c => c.openPositions));
    return (positions / max) * 100;
  }

  getTimeToHireClass(timeToHire: string): string {
    const days = parseInt(timeToHire.split(' ')[0]);
    if (days <= 18) return 'good';
    if (days <= 25) return 'medium';
    return 'poor';
  }

  getIndustryColor(industry: string): string {
    const colorMap: {[key: string]: string} = {
      'Cloud Computing': '#3498db',
      'Technology': '#2ecc71',
      'Data Analytics': '#9b59b6',
      'Software': '#e74c3c',
      'Design': '#1abc9c'
    };
    
    return colorMap[industry] || '#7f8c8d';
  }
}