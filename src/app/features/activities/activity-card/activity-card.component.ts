import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent {
  @Input() activity!: Activity;
  
  // Helper method to get a readable activity mode name
  getModeName(mode: string): string {
    switch (mode) {
      case 'FREE_INCREMENT':
        return 'Free Mode';
      case 'PENALTY_BALANCE':
        return 'Penalty Mode';
      default:
        return mode;
    }
  }
  
  // Helper method to get icon for activity mode
  getModeIcon(mode: string): string {
    switch (mode) {
      case 'FREE_INCREMENT':
        return 'trending_up';
      case 'PENALTY_BALANCE':
        return 'balance';
      default:
        return 'category';
    }
  }
  
  // Helper method to return only the first 3 participants
  getDisplayParticipants() {
    if (!this.activity.participants || this.activity.participants.length === 0) {
      return [];
    }
    return this.activity.participants.slice(0, 3);
  }
  
  // Helper method to count additional participants beyond the first 3
  getAdditionalParticipantsCount() {
    if (!this.activity.participants) {
      return 0;
    }
    const count = this.activity.participants.length - 3;
    return count > 0 ? count : 0;
  }

  // Returns a formatted date string
  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}