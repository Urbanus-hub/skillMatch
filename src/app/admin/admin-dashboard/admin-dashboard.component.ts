// admin-dashboard.component.ts
import { Component } from '@angular/core';
import { StatCardComponent } from '../components/stat-card/stat-card.component';
import { MatchesListComponent } from '../components/matches-list/matches-list.component';
import { SkillsListComponent } from '../components/skills-list/skills-list.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [StatCardComponent, MatchesListComponent, SkillsListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  // Method for report generation
  generateReport() {
    console.log('Generating report...');
    // Report generation logic
  }
}