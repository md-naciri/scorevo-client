import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtResponse, LoginRequest, MessageResponse, SignupRequest, User } from '../models/auth.models';

const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const tokenStr = localStorage.getItem('auth-token');
    const userStr = localStorage.getItem('auth-user');
    
    if (tokenStr && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(
      AUTH_API + 'signin',
      credentials,
      httpOptions
    ).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('auth-token', response.token);
          
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles
          };
          
          localStorage.setItem('auth-user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(user: SignupRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      AUTH_API + 'signup',
      user,
      httpOptions
    );
  }

  logout(): void {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.roles.includes(role);
  }

  // New method to update user profile information
  updateProfile(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `http://localhost:8080/api/users/${userId}`,
      userData,
      httpOptions
    ).pipe(
      tap(updatedUser => {
        // Update the current user in storage
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          const user: User = {
            ...currentUser,
            ...updatedUser
          };
          
          localStorage.setItem('auth-user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }
}