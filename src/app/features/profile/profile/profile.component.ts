import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { HeaderComponent } from '../../../layout/header/header.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.models';
import { UpdateProfileRequest } from '../../../core/models/profile.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HeaderComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  profileForm!: FormGroup;
  user: User | null = null;
  loading = true;
  submitting = false;
  error = '';
  successMessage = '';
  hidePassword = true;
  hideCurrentPassword = true;
  hideConfirmPassword = true;
  passwordChangeAttempted = false;

  ngOnInit(): void {
    this.initForm();
    this.loadUserProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
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
      currentPassword: [''],
      password: ['', [
        Validators.minLength(6),
        Validators.maxLength(40)
      ]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    // Disable/enable new password based on current password
    this.profileForm.get('currentPassword')?.valueChanges.subscribe(value => {
      const passwordControl = this.profileForm.get('password');
      const confirmControl = this.profileForm.get('confirmPassword');
      
      if (value) {
        passwordControl?.enable();
        confirmControl?.enable();
      } else {
        passwordControl?.disable();
        confirmControl?.disable();
      }
    });
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    } else {
      return null;
    }
  };

  private loadUserProfile(): void {
    this.loading = true;
    
    // First try to get user from AuthService cache
    this.user = this.authService.getCurrentUser();
    
    if (this.user) {
      this.patchFormValues();
      this.loading = false;
    } else {
      // If not available in cache, fetch from API
      this.userService.getProfile().subscribe({
        next: (user) => {
          this.user = user;
          this.patchFormValues();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load user profile.';
          this.loading = false;
        }
      });
    }
  }

  private patchFormValues(): void {
    if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email
      });
      
      // Mark the form as pristine after patching values
      this.profileForm.markAsPristine();
    }
  }

  resetForm(): void {
    this.passwordChangeAttempted = false;
    this.patchFormValues();
    this.profileForm.get('currentPassword')?.reset();
    this.profileForm.get('password')?.reset();
    this.profileForm.get('confirmPassword')?.reset();
    this.error = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (!this.profileForm.valid) {
      return;
    }

    // Check if password change is attempted without current password
    if ((this.profileForm.get('password')?.value || this.profileForm.get('confirmPassword')?.value) 
        && !this.profileForm.get('currentPassword')?.value) {
      this.passwordChangeAttempted = true;
      return;
    }

    // Only include fields that have been changed
    const updateData: UpdateProfileRequest = {};
    
    if (this.profileForm.get('username')?.dirty) {
      updateData.username = this.profileForm.get('username')?.value;
    }
    
    if (this.profileForm.get('email')?.dirty) {
      updateData.email = this.profileForm.get('email')?.value;
    }
    
    if (this.profileForm.get('password')?.value && this.profileForm.get('currentPassword')?.value) {
      updateData.currentPassword = this.profileForm.get('currentPassword')?.value;
      updateData.newPassword = this.profileForm.get('password')?.value;
    }

    // Skip update if nothing has changed
    if (Object.keys(updateData).length === 0) {
      return;
    }

    this.error = '';
    this.successMessage = '';
    this.submitting = true;
    
    if (this.user) {
      this.userService.updateProfile(this.user.id, updateData).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.successMessage = 'Profile updated successfully';
          this.submitting = false;
          
          // Reset password fields and mark form as pristine
          this.profileForm.get('currentPassword')?.reset();
          this.profileForm.get('password')?.reset();
          this.profileForm.get('confirmPassword')?.reset();
          this.profileForm.markAsPristine();
          this.passwordChangeAttempted = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update profile. Please try again.';
          this.submitting = false;
        }
      });
    }
  }
}