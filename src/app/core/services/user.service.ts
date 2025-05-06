import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/auth.models';
import { UpdateProfileRequest } from '../models/profile.models';

const API_URL = 'http://localhost:8080/api/users/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  // Get current user profile
  getProfile(): Observable<User> {
    return this.http.get<User>(API_URL + 'profile', httpOptions);
  }

  // Update user profile
  updateProfile(userId: number, updateData: any): Observable<User> {
    return this.http.put<User>(API_URL + userId, updateData, httpOptions);
  }
}