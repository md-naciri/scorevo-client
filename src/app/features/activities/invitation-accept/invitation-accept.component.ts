import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule
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
  ) {}

  ngOnInit(): void {
    this.invitationToken = this.route.snapshot.paramMap.get('token');
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
        this.invitation = invitation;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Invalid invitation or invitation has expired';
        this.loading = false;
      }
    });
  }

  acceptInvitation(): void {
    if (!this.invitationToken) return;

    this.processing = true;
    this.invitationService.acceptInvitation(this.invitationToken).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'Close', {
          duration: 3000
        });
        this.router.navigate(['/activities']);
      },
      error: (err) => {
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
    this.router.navigate(['/activities']);
  }
}