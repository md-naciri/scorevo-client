import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Score, ScoreRequest } from '../models/activity.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private baseApiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) { }

  /**
   * Get all scores for an activity
   */
  getActivityScores(activityId: number): Observable<Score[]> {
    return this.http.get<Score[]>(`${this.baseApiUrl}/${activityId}/scores`);
  }

  /**
   * Get scores for a specific user in an activity
   */
  getUserActivityScores(activityId: number, userId: number): Observable<Score[]> {
    return this.http.get<Score[]>(`${this.baseApiUrl}/${activityId}/scores/users/${userId}`);
  }

  /**
   * Get the current total score for each user in an activity
   */
  getCurrentScores(activityId: number): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseApiUrl}/${activityId}/scores/totals`);
  }

  /**
   * Add a new score
   */
  addScore(activityId: number, scoreRequest: ScoreRequest): Observable<Score> {
    return this.http.post<Score>(`${this.baseApiUrl}/${activityId}/scores`, scoreRequest);
  }

  /**
   * Delete a score
   */
  deleteScore(activityId: number, scoreId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/${activityId}/scores/${scoreId}`);
  }
}