import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Invitation, InvitationResponse } from '../models/invitation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private apiUrl = `${environment.apiUrl}/invitations`;

  constructor(private http: HttpClient) { }

  /**
   * Get pending invitations for the current user
   */
  getPendingInvitations(): Observable<Invitation[]> {
    console.log('InvitationService: Getting pending invitations from', `${this.apiUrl}/pending`);
    return this.http.get<Invitation[]>(`${this.apiUrl}/pending`).pipe(
      tap(response => console.log('InvitationService: Pending invitations response:', response)),
      catchError(error => {
        console.error('InvitationService: Error getting pending invitations:', error);
        throw error;
      })
    );
  }

  /**
   * Accept an invitation
   */
  acceptInvitation(token: string): Observable<InvitationResponse> {
    console.log('InvitationService: Accepting invitation with token:', token);
    return this.http.post<InvitationResponse>(`${this.apiUrl}/accept/${token}`, {}).pipe(
      tap(response => console.log('InvitationService: Accept invitation response:', response)),
      catchError(error => {
        console.error('InvitationService: Error accepting invitation:', error);
        throw error;
      })
    );
  }

  /**
   * Get invitation details by token
   */
  getInvitationDetails(token: string): Observable<Invitation> {
    console.log('InvitationService: Getting invitation details for token:', token);
    return this.http.get<Invitation>(`${this.apiUrl}/${token}`).pipe(
      tap(response => console.log('InvitationService: Invitation details response:', response)),
      catchError(error => {
        console.error('InvitationService: Error getting invitation details:', error);
        throw error;
      })
    );
  }

  /**
 * Decline an invitation
 */
  declineInvitation(token: string): Observable<InvitationResponse> {
    console.log('InvitationService: Declining invitation with token:', token);
    return this.http.post<InvitationResponse>(`${this.apiUrl}/decline/${token}`, {}).pipe(
      tap(response => console.log('InvitationService: Decline invitation response:', response)),
      catchError(error => {
        console.error('InvitationService: Error declining invitation:', error);
        throw error;
      })
    );
  }
}