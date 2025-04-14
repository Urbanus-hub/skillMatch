import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-matches-list',
  imports: [CommonModule],
  templateUrl: './matches-list.component.html',
  styleUrl: './matches-list.component.css'
})
export class MatchesListComponent {
  recentMatches = [
    {
      name: 'Sarah Chen',
      company: 'TechCorp',
      position: 'Senior Developer',
      score: 95,
      initials: 'SC'
    },
    {
      name: 'James Wilson',
      company: 'InnovateLabs',
      position: 'UX Designer',
      score: 92,
      initials: 'JW'
    },
    {
      name: 'Maria Garcia',
      company: 'DataFlow',
      position: 'Data Scientist',
      score: 89,
      initials: 'MG'
    }
  ];
}
