import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-home',
  imports: [CommonModule, RouterModule, AdminSidebarComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  isMobile = window.innerWidth < 768;
  isMenuOpen = !this.isMobile;
  
  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
      if (!this.isMobile) {
        this.isMenuOpen = true;
      }
    });
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
