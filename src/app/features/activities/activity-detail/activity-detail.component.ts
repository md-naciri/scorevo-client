import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Activity } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity.service';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { AddParticipantDialogComponent } from '../add-participant-dialog/add-participant-dialog.component';
import { FreeModeScoreComponent } from '../free-mode-score/free-mode-score.component';
import { PenaltyModeScoreComponent } from '../penalty-mode-score/penalty-mode-score.component';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FreeModeScoreComponent,
    PenaltyModeScoreComponent
  ],
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit {
  activity?: Activity;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadActivity();
  }

  loadActivity(): void {
    const activityId = Number(this.route.snapshot.paramMap.get('id'));

    if (!activityId) {
      this.error = 'Invalid activity ID';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = '';

    this.activityService.getActivityById(activityId).subscribe({
      next: (activity) => {
        this.activity = activity;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load activity';
        this.loading = false;
      }
    });
  }

  // Add explicit navigation method
  goToActivities(): void {
    console.log('Navigating to activities list');
    this.router.navigate(['/activities']);
  }

  openAddParticipantDialog(): void {
    if (!this.activity) return;

    const dialogRef = this.dialog.open(AddParticipantDialogComponent, {
      width: '500px',
      data: { activityId: this.activity.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActivity(); // Refresh activity data
        this.snackBar.open('Participant added successfully', 'Close', {
          duration: 3000
        });
      }
    });
  }

  removeParticipant(participantId: number): void {
    if (!this.activity) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Remove Participant',
        message: 'Are you sure you want to remove this participant from the activity?',
        confirmText: 'Remove',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activityService.removeParticipant(this.activity!.id, participantId).subscribe({
          next: () => {
            this.loadActivity(); // Refresh activity data
            this.snackBar.open('Participant removed successfully', 'Close', {
              duration: 3000
            });
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Failed to remove participant', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    });
  }

  deleteActivity(): void {
    if (!this.activity) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Activity',
        message: `Are you sure you want to delete "${this.activity.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Attempting to delete activity:', this.activity?.id);

        this.activityService.deleteActivity(this.activity!.id).subscribe({
          next: () => {
            console.log('Activity deleted successfully');
            this.router.navigate(['/activities']);
            this.snackBar.open('Activity deleted successfully', 'Close', {
              duration: 3000
            });
          },
          error: (err) => {
            console.error('Error deleting activity:', err);
            let errorMessage = 'Failed to delete activity';

            if (err.error && err.error.message) {
              errorMessage = err.error.message;
            } else if (err.message) {
              errorMessage = err.message;
            }

            this.snackBar.open(errorMessage, 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    });
  }

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

  // Helper method to format a date
  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}