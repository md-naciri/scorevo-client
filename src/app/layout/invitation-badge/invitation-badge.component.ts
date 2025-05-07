import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { InvitationService } from '../../core/services/invitation.service';
import { Invitation } from '../../core/models/invitation.model';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
export class InvitationBadgeComponent implements OnInit, OnDestroy {
  pendingInvitations: Invitation[] = [];
  loading = false;
  private refreshSubscription?: Subscription;

  constructor(
    private invitationService: InvitationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingInvitations();
    
    // Refresh invitations every 30 seconds
    this.refreshSubscription = interval(30000).pipe(
      switchMap(() => {
        // Only load if not currently loading
        if (!this.loading) {
          return this.invitationService.getPendingInvitations();
        }
        return [];
      })
    ).subscribe(invitations => {
      if (invitations.length > 0) {
        this.pendingInvitations = invitations.filter(inv => !inv.isExpired);
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
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
  
  goToInvitation(token: string, event: Event): void {
    event.stopPropagation(); // Prevent menu click from closing menu
    this.router.navigate(['/invitations/accept', token]);
  }
}