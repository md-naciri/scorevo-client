// Authentication request models
export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    roles?: string[];
  }
  
  // Authentication response models
  export interface JwtResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
  }
  
  export interface MessageResponse {
    message: string;
  }
  
  // User model
  export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
  }