// skills.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterLink,RouterModule} from '@angular/router';





@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterLink,RouterModule],
  standalone: true
})
export class SkillsComponent implements OnInit {
  categories: string[] = [
    'Programming',
    'Design',
    'Marketing',
    'Business',
    'Data science',
    'Project Management',
    'Communication',
    'Finance',
    'Human Resources',
    'Sales'
  ];
  
  selectedCategory: string = 'Programming';
  searchQuery: string = '';
  
  skills: { [key: string]: { name: string, description: string }[] } = {
    'Programming': [
      { name: 'JavaScript', description: 'Programming language' },
      { name: 'React', description: 'Frontend framework' },
      { name: 'Angular', description: 'Frontend framework' },
      { name: 'Vue.js', description: 'Frontend framework' },
      { name: 'Node.js', description: 'Backend development' },
      { name: 'Python', description: 'Programming language' },
      { name: 'Java', description: 'Programming language' },
      { name: 'Ruby', description: 'Programming language' }
    ],
    'Design': [
      { name: 'UI Design', description: 'User interface design' },
      { name: 'UX Design', description: 'User experience design' }
    ],
    // Other categories would be populated similarly
  };
  
  selectedSkills: string[] = ['JavaScript', 'React', 'Java'];
  
  constructor() { }
  
  ngOnInit(): void { }
  
  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
  
  toggleSkill(skillName: string): void {
    if (this.isSkillSelected(skillName)) {
      this.selectedSkills = this.selectedSkills.filter(skill => skill !== skillName);
    } else {
      this.selectedSkills.push(skillName);
    }
  }
  
  isSkillSelected(skillName: string): boolean {
    return this.selectedSkills.includes(skillName);
  }
  
  removeSkill(skillName: string): void {
    this.selectedSkills = this.selectedSkills.filter(skill => skill !== skillName);
  }
  
  goBack(): void {
    // Navigation logic to go back
    console.log('Going back to previous step');
  }
  
  continue(): void {
    // Navigation logic to continue
    console.log('Continuing to next step with skills:', this.selectedSkills);
  }
}