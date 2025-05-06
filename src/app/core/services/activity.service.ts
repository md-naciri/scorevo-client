import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, ActivityRequest, Participant } from '../models/activity.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) { }

  /**
   * Get all activities for the current user
   */
  getUserActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  /**
   * Get a specific activity by ID
   */
  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new activity
   */
  createActivity(activityRequest: ActivityRequest): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activityRequest);
  }

  /**
   * Update an existing activity
   */
  updateActivity(id: number, activityRequest: ActivityRequest): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, activityRequest);
  }

  /**
   * Delete an activity
   */
  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add a participant to an activity by user ID
   */
  addParticipant(activityId: number, userId: number): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/${activityId}/participants/${userId}`, {});
  }

  /**
   * Add a participant to an activity by email
   */
  addParticipantByEmail(activityId: number, email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/${activityId}/participants/email`,
      null,
      { params: { email } }
    );
  }

  /**
   * Remove a participant from an activity
   */
  removeParticipant(activityId: number, userId: number): Observable<Activity> {
    return this.http.delete<Activity>(`${this.apiUrl}/${activityId}/participants/${userId}`);
  }
}