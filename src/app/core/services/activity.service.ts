import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
    console.log('Getting user activities from:', this.apiUrl);
    return this.http.get<Activity[]>(this.apiUrl).pipe(
      tap(response => console.log('Activities response:', response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get a specific activity by ID
   */
  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a new activity
   */
  createActivity(activityRequest: ActivityRequest): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activityRequest).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing activity
   */
  updateActivity(id: number, activityRequest: ActivityRequest): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, activityRequest).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete an activity
   */
  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add a participant to an activity by user ID
   */
  addParticipant(activityId: number, userId: number): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/${activityId}/participants/${userId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add a participant to an activity by email
   */
  addParticipantByEmail(activityId: number, email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/${activityId}/participants/email`,
      null,
      { params: { email } }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Remove a participant from an activity
   */
  removeParticipant(activityId: number, userId: number): Observable<Activity> {
    return this.http.delete<Activity>(`${this.apiUrl}/${activityId}/participants/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler
   */
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status) {
        errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}