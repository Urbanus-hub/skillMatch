import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-companies',
  imports: [CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {
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
      avgTimeToHire: '20 days'
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
      avgTimeToHire: '18 days'
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
      avgTimeToHire: '23 days'
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
      avgTimeToHire: '21 days'
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
      avgTimeToHire: '15 days'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
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
}