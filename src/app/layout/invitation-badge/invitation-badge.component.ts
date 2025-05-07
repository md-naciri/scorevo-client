import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { InvitationService } from '../../core/services/invitation.service';
import { Invitation } from '../../core/models/invitation.model';

@Component({
  selector: 'app-invitation-badge',
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './invitation-badge.component.html',
  styleUrls: ['./invitation-badge.component.scss']
})
export class InvitationBadgeComponent implements OnInit {
  pendingInvitations: Invitation[] = [];
  loading = false;

  constructor(private invitationService: InvitationService) {}

  ngOnInit(): void {
    this.loadPendingInvitations();
  }

  loadPendingInvitations(): void {
    this.loading = true;
    this.invitationService.getPendingInvitations().subscribe({
      next: (invitations) => {
        this.pendingInvitations = invitations.filter(inv => !inv.isExpired);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}