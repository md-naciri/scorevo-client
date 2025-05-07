export interface Invitation {
    id: number;
    token: string;
    email: string;
    activityId: number;
    activityName: string;
    invitedBy: string;
    createdAt: string;
    expiresAt: string;
    isExpired: boolean;
  }
  
  export interface InvitationResponse {
    message: string;
  }