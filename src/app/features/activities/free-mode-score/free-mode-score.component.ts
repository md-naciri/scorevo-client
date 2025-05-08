import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScoreService } from '../../../core/services/score.service';
import { Participant, Score, ScoreRequest } from '../../../core/models/activity.model';

@Component({
  selector: 'app-free-mode-score',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './free-mode-score.component.html',
  styleUrls: ['./free-mode-score.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FreeModeScoreComponent implements OnInit {
  @Input() activityId!: number;
  @Input() participants: Participant[] = [];
  
  totalScores: Record<string, number> = {};
  recentScores: Score[] = [];
  loadingScores = true;
  error = '';
  
  // Point options for quick selection
  pointOptions = [1, 2, 5, 10, 25, 50, 100];
  
  // Custom points overlay
  showCustomPointsOverlay = false;
  selectedParticipant: Participant | null = null;
  customPoints = 1;
  
  constructor(
    private scoreService: ScoreService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadScores();
  }
  
  loadScores(): void {
    this.loadingScores = true;
    
    // Get total scores for each participant
    this.scoreService.getCurrentScores(this.activityId).subscribe({
      next: (scores) => {
        this.totalScores = scores;
        
        // Get recent score entries
        this.scoreService.getActivityScores(this.activityId).subscribe({
          next: (scores) => {
            // Sort by timestamp descending
            this.recentScores = scores.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            ).slice(0, 10); // Only show the 10 most recent
            
            this.loadingScores = false;
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to load score history';
            this.loadingScores = false;
          }
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load scores';
        this.loadingScores = false;
      }
    });
  }
  
  // Quick add score directly from participant card
  quickAddScore(participant: Participant, points: number): void {
    this.addScore(participant.id, points);
  }
  
  // Open overlay for custom point entry
  openScoreOverlay(participant: Participant): void {
    this.selectedParticipant = participant;
    this.customPoints = 1;
    this.showCustomPointsOverlay = true;
  }
  
  closeOverlay(): void {
    this.showCustomPointsOverlay = false;
    this.selectedParticipant = null;
  }
  
  setCustomPoints(points: number): void {
    this.customPoints = points;
  }
  
  addCustomPoints(): void {
    if (this.selectedParticipant && this.customPoints && this.customPoints > 0) {
      this.addScore(this.selectedParticipant.id, this.customPoints);
      this.closeOverlay();
    }
  }
  
  // Core method to add score to the database
  private addScore(userId: number, points: number): void {
    const scoreRequest: ScoreRequest = {
      userId: userId,
      points: points
    };
    
    this.scoreService.addScore(this.activityId, scoreRequest).subscribe({
      next: () => {
        // Show success message
        const participantName = this.getParticipantName(userId);
        this.snackBar.open(`Added ${points} points to ${participantName}`, 'Close', {
          duration: 2000
        });
        
        // Reload scores
        this.loadScores();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add score';
        this.snackBar.open(this.error, 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
  
  // Helper to get participant name by ID
  getParticipantName(id: number): string {
    const participant = this.participants.find(p => p.id === id);
    return participant ? participant.username : 'Unknown';
  }
  
  // Format timestamp to a readable date
  formatDate(timestamp: string): string {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}