import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivityService } from '../../../core/services/activity.service';
import { CommonModule } from '@angular/common';
import { ActivityRequest } from '../../../core/models/activity.model';

@Component({
  selector: 'app-create-activity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './create-activity-dialog.component.html',
  styleUrls: ['./create-activity-dialog.component.scss']
})
export class CreateActivityDialogComponent {
  activityForm: FormGroup;
  loading = false;
  error = '';

  // Activity mode descriptions
  modeDocs = {
    FREE_INCREMENT: 'Each participant accumulates points independently. Points are always positive and there\'s no interaction between scores.',
    PENALTY_BALANCE: 'When a player makes a mistake, their score increases. When scores become equal, they reset to zero.'
  };

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private dialogRef: MatDialogRef<CreateActivityDialogComponent>
  ) {
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      mode: ['FREE_INCREMENT', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const activityRequest: ActivityRequest = {
      name: this.activityForm.get('name')?.value,
      description: this.activityForm.get('description')?.value,
      mode: this.activityForm.get('mode')?.value
    };

    this.activityService.createActivity(activityRequest).subscribe({
      next: (activity) => {
        this.loading = false;
        this.dialogRef.close(activity);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create activity. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}