import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-skills-list',
  imports: [CommonModule],
  templateUrl: './skills-list.component.html',
  styleUrl: './skills-list.component.css'
})
export class SkillsListComponent {
  topSkills = [
    {
      name: 'Machine Learning',
      users: 342
    },
    {
      name: 'React.js',
      users: 289
    },
    {
      name: 'Python',
      users: 276
    },
    {
      name: 'Data Analysis',
      users: 245
    }
  ];
}
