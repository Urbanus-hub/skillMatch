import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface SkillDemand {
  name: string;
  count: number;
  percentage: number;
  color?: string;
}

interface ChartDataPoint {
  value: number;
  label: string;
}

interface StatCard {
  title: string;
  value: string;
  icon?: string;
  trend?: string;
  color?: string;
}

interface Location {
  name: string;
  count: string;
  percentage: number;
}

interface Activity {
  id: number;
  type: 'job-post' | 'application' | 'interview' | 'hired';
  title: string;
  company: string;
  time: string;
}

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css'
})
export class AdminAnalyticsComponent implements OnInit {
  statCards: StatCard[] = [
    { 
      title: 'Total Jobs Posted', 
      value: '2,451', 
      icon: 'work', 
      trend: '+15%', 
      color: '#4361ee' 
    },
    { 
      title: 'Active Jobs', 
      value: '1,832', 
      icon: 'business_center', 
      trend: '+8%', 
      color: '#3a0ca3' 
    },
    { 
      title: 'Total Applicants', 
      value: '12,405', 
      icon: 'people', 
      trend: '+21%', 
      color: '#4cc9f0' 
    },
    { 
      title: 'Avg. Time to Hire', 
      value: '23 days', 
      icon: 'schedule', 
      trend: '-4%', 
      color: '#4ade80' 
    }
  ];

  topSkills: SkillDemand[] = [
    { name: 'JavaScript', count: 842, percentage: 100, color: '#4361ee' },
    { name: 'Python', count: 654, percentage: 78, color: '#4cc9f0' },
    { name: 'React', count: 521, percentage: 62, color: '#f72585' },
    { name: 'SQL', count: 498, percentage: 59, color: '#4ade80' },
    { name: 'Java', count: 432, percentage: 51, color: '#3a0ca3' }
  ];

  jobsGrowthData: ChartDataPoint[] = [
    { value: 2100, label: 'Jan' },
    { value: 2300, label: 'Feb' },
    { value: 2150, label: 'Mar' },
    { value: 2400, label: 'Apr' },
    { value: 2350, label: 'May' },
    { value: 2451, label: 'Jun' }
  ];

  topLocations: Location[] = [
    { name: 'San Francisco', count: '645', percentage: 78 },
    { name: 'New York', count: '520', percentage: 72 },
    { name: 'London', count: '483', percentage: 63 },
    { name: 'Berlin', count: '374', percentage: 56 },
    { name: 'Singapore', count: '321', percentage: 48 }
  ];

  recentActivities: Activity[] = [
    { id: 1, type: 'job-post', title: 'Senior Frontend Developer', company: 'TechCorp', time: '2 hours ago' },
    { id: 2, type: 'application', title: 'UX Designer', company: 'CreativeStudio', time: '5 hours ago' },
    { id: 3, type: 'interview', title: 'Backend Engineer', company: 'DataSystems', time: '1 day ago' },
    { id: 4, type: 'hired', title: 'Product Manager', company: 'InnovateTech', time: '2 days ago' }
  ];

  maxChartValue = 2500;
  activeTimeFilter = 'Year';

  constructor() {}

  ngOnInit(): void {
    // Calculate the maximum value for chart scaling
    this.maxChartValue = Math.max(...this.jobsGrowthData.map(item => item.value));
  }

  setTimeFilter(filter: string): void {
    this.activeTimeFilter = filter;
    
    // Simulate updating chart data based on filter selection
    if (filter === 'Week') {
      this.jobsGrowthData = [
        { value: 350, label: 'Mon' },
        { value: 420, label: 'Tue' },
        { value: 380, label: 'Wed' },
        { value: 450, label: 'Thu' },
        { value: 410, label: 'Fri' },
        { value: 290, label: 'Sat' },
        { value: 220, label: 'Sun' }
      ];
    } else if (filter === 'Month') {
      this.jobsGrowthData = [
        { value: 510, label: 'Week 1' },
        { value: 580, label: 'Week 2' },
        { value: 620, label: 'Week 3' },
        { value: 741, label: 'Week 4' }
      ];
    } else {
      this.jobsGrowthData = [
        { value: 2100, label: 'Jan' },
        { value: 2300, label: 'Feb' },
        { value: 2150, label: 'Mar' },
        { value: 2400, label: 'Apr' },
        { value: 2350, label: 'May' },
        { value: 2451, label: 'Jun' }
      ];
    }
    
    // Recalculate max value for chart scaling
    this.maxChartValue = Math.max(...this.jobsGrowthData.map(item => item.value));
  }
  
  // Helper method for calculating chart bar height
  getBarHeight(value: number): string {
    return `${(value / this.maxChartValue * 100)}%`;
  }
}