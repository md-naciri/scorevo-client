import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../../core/services/activity.service';

@Component({
  selector: 'app-add-participant-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './add-participant-dialog.component.html',
  styleUrls: ['./add-participant-dialog.component.scss']
})
export class AddParticipantDialogComponent {
  participantForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private dialogRef: MatDialogRef<AddParticipantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { activityId: number }
  ) {
    this.participantForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.participantForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const email = this.participantForm.get('email')?.value;

    this.activityService.addParticipantByEmail(this.data.activityId, email).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = response.message;
        
        // Close dialog after a short delay to allow user to see success message
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to add participant. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}