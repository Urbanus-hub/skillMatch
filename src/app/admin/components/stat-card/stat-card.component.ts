import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule, NgClass],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() change = '';
  @Input() changeType: 'increase' | 'decrease' = 'increase';
}
