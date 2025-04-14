// skill-match.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule,RouterLink}from '@angular/router';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';

interface CareerField {
  id: number;
  name: string;
  selected: boolean;
  icon: string;
  count?: number;
}

@Component({
  selector: 'app-skill-match',
  templateUrl: './career-fields.component.html',
  styleUrls: ['./career-fields.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule,RouterModule,RouterLink],
  standalone: true,
  providers: []
})
export class CareerFieldsComponent implements OnInit {
  userName = "John Doe";
  companyName = "TechCorp Solutions";
  progress = 50; // progress percentage
  currentStep = 2;
  totalSteps = 4;
  
  menuItems = [
    { id: 1, name: 'Contacts', selected: true, completed: true, icon: 'people' },
    { id: 2, name: 'Career fields', selected: false, completed: false, icon: 'work' },
    { id: 3, name: 'Enterprise details', selected: false, completed: false, icon: 'business' }
  ];

  careerFields: CareerField[] = [
    { id: 1, name: 'Information Technology and Mathematics', selected: false, icon: 'computer', count: 1254 },
    { id: 2, name: 'Sales and Promotion', selected: false, icon: 'trending_up', count: 873 },
    { id: 3, name: 'Architecture and Engineering', selected: false, icon: 'architecture', count: 645 },
    { id: 4, name: 'Management and Legal', selected: false, icon: 'gavel', count: 422 },
    { id: 5, name: 'Healthcare Practitioners and Support', selected: false, icon: 'medical_services', count: 963 },
    { id: 6, name: 'Education and Training', selected: false, icon: 'school', count: 532 },
    { id: 7, name: 'Life, Physical and Social Science', selected: false, icon: 'science', count: 316 },
    { id: 8, name: 'Art Design, and Media', selected: false, icon: 'palette', count: 734 },
    { id: 9, name: 'Business and Financial Operations', selected: false, icon: 'account_balance', count: 892 },
    { id: 10, name: 'Transport and Logistics', selected: false, icon: 'local_shipping', count: 437 },
    { id: 11, name: 'Production', selected: false, icon: 'precision_manufacturing', count: 286 },
    { id: 12, name: 'Installation/Maintenance and Repair', selected: false, icon: 'build', count: 349 }
  ];

  locations = [
    { id: 1, name: 'New York', selected: true },
    { id: 2, name: 'San Francisco', selected: false },
    { id: 3, name: 'London', selected: false },
    { id: 4, name: 'Singapore', selected: false },
    { id: 5, name: 'Tokyo', selected: false }
  ];

  selectedLocation = this.locations[0];
  showLocationDropdown = false;
  
  constructor() {}

  ngOnInit(): void {
    this.selectMenuItem(2);
  }

  selectMenuItem(itemId: number): void {
    this.menuItems.forEach(item => {
      item.selected = item.id === itemId;
    });
  }

  toggleCareerField(field: CareerField): void {
    field.selected = !field.selected;
    // Ripple animation removed to improve performance
  }

  toggleLocationDropdown(): void {
    this.showLocationDropdown = !this.showLocationDropdown;
  }

  selectLocation(location: any): void {
    this.locations.forEach(loc => loc.selected = false);
    location.selected = true;
    this.selectedLocation = location;
    this.showLocationDropdown = false;
  }

  getSelectedCount(): number {
    return this.careerFields.filter(field => field.selected).length;
  }

  goBack(): void {
    // Implementation for back button functionality
    console.log('Going back');
  }

  goNext(): void {
    // Implementation for next button functionality
    console.log('Going to next page');
    console.log('Selected career fields:', this.careerFields.filter(field => field.selected));
  }
}