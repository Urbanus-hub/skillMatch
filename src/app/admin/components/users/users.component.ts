import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';

interface ActivityItem {
  type: 'user' | 'job' | 'skill';
  action: string;
  time: string;
  icon: string;
}
@Component({
  selector: 'app-users',
  imports: [CommonModule, NgClass],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  recentActivities: ActivityItem[] = [
    {
      type: 'user',
      action: 'New user registered',
      time: '2 minutes ago',
      icon: 'fa-user'
    },
    {
      type: 'job',
      action: 'New job posted',
      time: '5 minutes ago',
      icon: 'fa-briefcase'
    },
    {
      type: 'skill',
      action: 'New skill added',
      time: '10 minutes ago',
      icon: 'fa-clipboard-list'
    }
  ];

  userGrowthData = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 180 },
    { month: 'Mar', value: 160 },
    { month: 'Apr', value: 220 },
    { month: 'May', value: 280 },
    { month: 'Jun', value: 320 }
  ];

  maxValue = 320; // Highest value in the chart data

  constructor() { }

  ngOnInit(): void {
    // Calculate the max value for the chart
    this.maxValue = Math.max(...this.userGrowthData.map(item => item.value));
  }
}
