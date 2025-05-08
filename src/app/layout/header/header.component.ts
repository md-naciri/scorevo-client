import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { InvitationService } from '../../core/services/invitation.service';
import { User } from '../../core/models/auth.models';
import { Invitation } from '../../core/models/invitation.model';
import { interval, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private invitationService = inject(InvitationService);
  private cdr = inject(ChangeDetectorRef);
  
  currentUser: User | null = null;
  logoUrl = 'assets/images/sco-inverted-logo.png';
  pendingInvitations: Invitation[] = [];
  invitationCount = 0;
  
  private refreshSubscription?: Subscription;
  
  ngOnInit(): void {
    console.log('HeaderComponent initialized');
    
    this.authService.currentUser$.subscribe(user => {
      console.log('Current user updated:', user);
      this.currentUser = user;
      
      if (user) {
        console.log('User is logged in, loading invitations');
        // Initial load
        this.loadPendingInvitations();
        
        // Setup refresh interval (every 30 seconds)
        this.setupRefreshInterval();
      } else {
        console.log('No user logged in');
        this.pendingInvitations = [];
        this.invitationCount = 0;
        if (this.refreshSubscription) {
          this.refreshSubscription.unsubscribe();
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  setupRefreshInterval(): void {
    // Cancel any existing subscription
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    
    // Set up periodic refresh
    this.refreshSubscription = interval(15000) // Check every 15 seconds
      .pipe(
        switchMap(() => this.invitationService.getPendingInvitations().pipe(take(1)))
      )
      .subscribe(invitations => {
        console.log('Refresh interval - invitations:', invitations);
        if (Array.isArray(invitations)) {
          this.pendingInvitations = invitations.filter(inv => !inv.isExpired);
          this.invitationCount = this.pendingInvitations.length;
          this.cdr.detectChanges(); // Force change detection
        }
      });
  }
  
  loadPendingInvitations(): void {
    console.log('Attempting to load pending invitations');
    
    this.invitationService.getPendingInvitations().subscribe({
      next: (invitations) => {
        console.log('Raw invitations received:', invitations);
        
        if (Array.isArray(invitations)) {
          this.pendingInvitations = invitations.filter(inv => !inv.isExpired);
          this.invitationCount = this.pendingInvitations.length;
          console.log('Filtered pending invitations:', this.pendingInvitations);
          console.log('Pending invitation count:', this.invitationCount);
          
          // Force change detection
          this.cdr.detectChanges();
        } else {
          console.error('Invitations is not an array:', invitations);
          this.pendingInvitations = [];
          this.invitationCount = 0;
        }
      },
      error: (err) => {
        console.error('Error loading invitations:', err);
        this.pendingInvitations = [];
        this.invitationCount = 0;
      }
    });
  }
  
  navigateToInvitation(token: string, event: Event): void {
    console.log('Navigation to invitation triggered with token:', token);
    event.preventDefault();
    event.stopPropagation();
    
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.router.navigate(['/invitations/accept', token]);
    });
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}