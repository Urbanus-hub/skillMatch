import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterModule, NgClass],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  @Input() isMobile = false;
  @Input() isMenuOpen = true;
  @Output() toggleMenu = new EventEmitter<void>();
  
  currentRoute = '';
  
  navItems: any[] = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { path: '/admin/users', label: 'Users', icon: 'fa-users' },
    { path: '/admin/jobs', label: 'Jobs', icon: 'fa-briefcase' },
    { path: '/admin/analytics', label: 'Analytics', icon: 'fa-chart-line' },
    { path: '/admin/companies', label: 'Companies', icon: 'fa-building' },
    // Additional routes can be added here
  ];
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Subscribe to router events to update active state
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
    
    // Initialize current route
    this.currentRoute = this.router.url;
  }
  
  isActive(path: string): boolean {
    // Check if the current route starts with this path
    return this.currentRoute.startsWith(path);
  }
  
  navigateTo(path: string): void {
    this.router.navigate([path]);
    if (this.isMobile) {
      this.onToggleMenu(); // Close sidebar on navigation in mobile
    }
  }
  
  onToggleMenu() {
    this.toggleMenu.emit();
  }
  
  logout() {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: this.authService.logout();
    this.router.navigate(['/login']);
  }
}
