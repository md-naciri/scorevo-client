import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { InvitationService } from '../../../core/services/invitation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private invitationService = inject(InvitationService);

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  hidePassword = true;
  invitationToken: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Auto-navigate if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }

    // Check if we have an invitation token in the URL
    this.route.queryParams.subscribe(params => {
      if (params['invitation']) {
        this.invitationToken = params['invitation'];
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login({
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }).subscribe({
      next: () => {
        // If we have an invitation token, accept it first
        if (this.invitationToken) {
          this.acceptInvitation();
        } else {
          this.router.navigate(['/activities']);
        }
      },
      error: err => {
        this.error = err.error?.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }

  private acceptInvitation(): void {
    if (!this.invitationToken) return;

    this.invitationService.acceptInvitation(this.invitationToken).subscribe({
      next: (response) => {
        // Navigate to the activity
        this.router.navigate(['/activities']);
      },
      error: (err) => {
        console.error('Failed to accept invitation:', err);
        // Still navigate to the main page even if accepting invitation fails
        this.router.navigate(['/activities']);
      }
    });
  }
}