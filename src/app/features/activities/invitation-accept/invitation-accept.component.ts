import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { InvitationService } from '../../../core/services/invitation.service';
import { Invitation } from '../../../core/models/invitation.model';

@Component({
  selector: 'app-invitation-accept',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './invitation-accept.component.html',
  styleUrls: ['./invitation-accept.component.scss']
})
export class InvitationAcceptComponent implements OnInit {
  loading = true;
  processing = false;
  error = '';
  invitation?: Invitation;
  invitationToken: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invitationService: InvitationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.invitationToken = this.route.snapshot.paramMap.get('token');
    console.log('Token from URL:', this.invitationToken); // Debug logging

    if (this.invitationToken) {
      this.loadInvitationDetails();
    } else {
      this.error = 'Invalid invitation link';
      this.loading = false;
    }
  }

  loadInvitationDetails(): void {
    if (!this.invitationToken) return;

    this.invitationService.getInvitationDetails(this.invitationToken).subscribe({
      next: (invitation) => {
        console.log('Invitation details loaded:', invitation); // Debug logging
        this.invitation = invitation;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading invitation details:', err); // Debug logging
        this.error = 'Invalid invitation or invitation has expired';
        this.loading = false;
      }
    });
  }

  acceptInvitation(): void {
    if (!this.invitationToken) return;

    console.log('Accepting invitation with token:', this.invitationToken); // Debug logging
    this.processing = true;
    this.invitationService.acceptInvitation(this.invitationToken).subscribe({
      next: (response) => {
        console.log('Invitation accepted:', response); // Debug logging
        this.snackBar.open(response.message, 'Close', {
          duration: 3000
        });
        this.router.navigate(['/activities']);
      },
      error: (err) => {
        console.error('Error accepting invitation:', err); // Debug logging
        this.error = err.error?.message || 'Failed to accept invitation';
        this.processing = false;
        this.snackBar.open('Failed to accept invitation: ' + this.error, 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  declineInvitation(): void {
    if (!this.invitationToken) return;

    this.processing = true;
    this.invitationService.declineInvitation(this.invitationToken).subscribe({
      next: (response) => {
        this.snackBar.open('Invitation declined', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/activities']);
      },
      error: (err) => {
        console.error('Error declining invitation:', err);
        // Still navigate away even if there's an error
        this.router.navigate(['/activities']);
      }
    });
  }
}