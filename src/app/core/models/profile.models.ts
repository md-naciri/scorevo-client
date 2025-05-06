export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ProfileState {
  loading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}