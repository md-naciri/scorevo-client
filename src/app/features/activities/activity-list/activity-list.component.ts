import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityService } from '../../../core/services/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { CreateActivityDialogComponent } from '../create-activity-dialog/create-activity-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivityCardComponent } from '../activity-card/activity-card.component';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
    ActivityCardComponent
  ],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];
  loading = true;
  error = '';

  constructor(
    private activityService: ActivityService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    this.error = '';
    
    this.activityService.getUserActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load activities';
        this.loading = false;
      }
    });
  }

  openCreateActivityDialog(): void {
    const dialogRef = this.dialog.open(CreateActivityDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActivities(); // Refresh the activity list
        this.snackBar.open('Activity created successfully!', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      }
    });
  }

  viewActivity(activityId: number): void {
    this.router.navigate(['/activities', activityId]);
  }
}