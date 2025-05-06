import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScoreService } from '../../../core/services/score.service';
import { Participant, Score, ScoreRequest } from '../../../core/models/activity.model';

@Component({
  selector: 'app-penalty-mode-score',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './penalty-mode-score.component.html',
  styleUrls: ['./penalty-mode-score.component.scss']
})
export class PenaltyModeScoreComponent implements OnInit {
  @Input() activityId!: number;
  @Input() participants: Participant[] = [];
  
  scoreForm!: FormGroup;
  totalScores: Record<string, number> = {};
  recentScores: Score[] = [];
  loading = false;
  loadingScores = true;
  error = '';
  
  // Point options for quick selection
  pointOptions = [1, 2, 5];
  
  constructor(
    private fb: FormBuilder,
    private scoreService: ScoreService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.loadScores();
  }
  
  private initForm(): void {
    this.scoreForm = this.fb.group({
      userId: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1)]]
    });
    
    // Pre-select first participant if available
    if (this.participants.length > 0) {
      this.scoreForm.get('userId')?.setValue(this.participants[0].id);
    }
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
  
  onSubmit(): void {
    if (this.scoreForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const scoreRequest: ScoreRequest = {
      userId: this.scoreForm.get('userId')?.value,
      points: this.scoreForm.get('points')?.value
    };
    
    this.scoreService.addScore(this.activityId, scoreRequest).subscribe({
      next: () => {
        this.loading = false;
        
        // Reset points to 1 but keep the selected user
        this.scoreForm.get('points')?.setValue(1);
        
        // Reload scores
        this.loadScores();
        
        // Show success message
        this.snackBar.open('Mistake recorded successfully', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to record mistake';
      }
    });
  }
  
  setPoints(points: number): void {
    this.scoreForm.get('points')?.setValue(points);
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
  
  // Helper to get participant by ID
  getParticipant(id: number): Participant | undefined {
    return this.participants.find(p => p.id === id);
  }
  
  // Get a participant score (or 0 if not found)
  getScore(participantId: number): number {
    return this.totalScores[participantId] || 0;
  }
  
  // Get a formatted score description indicating penalties
  getScoreDescription(score: number): string {
    if (score === 0) {
      return 'No Penalties';
    } else if (score === 1) {
      return '1 Penalty';
    } else {
      return `${score} Penalties`;
    }
  }
}