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
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private invitationService = inject(InvitationService);

  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  hidePassword = true;
  invitationToken: string | null = null;
  invitationDetails: any = null;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40)
      ]]
    });

    // Auto-navigate if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }

    // Check if we have an invitation token in the URL
    this.route.queryParams.subscribe(params => {
      if (params['invitation']) {
        this.invitationToken = params['invitation'];
        this.loadInvitationDetails();
      }
    });
  }

  private loadInvitationDetails(): void {
    if (this.invitationToken) {
      this.invitationService.getInvitationDetails(this.invitationToken).subscribe({
        next: (invitation) => {
          this.invitationDetails = invitation;
          
          // Pre-fill email field with invitation email
          this.registerForm.get('email')?.setValue(invitation.email);
          this.registerForm.get('email')?.disable(); // Prevent changing the email
        },
        error: (err) => {
          this.error = 'Invalid invitation token. Please try registering normally.';
          this.invitationToken = null;
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Make sure to use the invitation email if present
    let email = this.registerForm.get('email')?.value;
    if (this.registerForm.get('email')?.disabled && this.invitationDetails) {
      email = this.invitationDetails.email;
    }
    
    this.authService.register({
      username: this.registerForm.get('username')?.value,
      email: email,
      password: this.registerForm.get('password')?.value
    }).subscribe({
      next: response => {
        this.success = response.message || 'Registration successful!';
        
        if (this.invitationToken) {
          this.success += ' You will be automatically added to the activity you were invited to after logging in.';
        }
        
        this.loading = false;
        
        // Redirect to login after a brief delay
        setTimeout(() => {
          if (this.invitationToken) {
            this.router.navigate(['/auth/login'], { queryParams: { invitation: this.invitationToken } });
          } else {
            this.router.navigate(['/auth/login']);
          }
        }, 2000);
      },
      error: err => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}