import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Invitation[]>(`${this.apiUrl}/pending`);
  }

  /**
   * Accept an invitation
   */
  acceptInvitation(token: string): Observable<InvitationResponse> {
    return this.http.post<InvitationResponse>(`${this.apiUrl}/accept/${token}`, {});
  }

  /**
   * Get invitation details by token
   */
  getInvitationDetails(token: string): Observable<Invitation> {
    return this.http.get<Invitation>(`${this.apiUrl}/${token}`);
  }
}