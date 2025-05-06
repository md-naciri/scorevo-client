export interface Activity {
    id: number;
    name: string;
    description?: string;
    mode: 'FREE_INCREMENT' | 'PENALTY_BALANCE';
    createdAt: string;
    participants: Participant[];
  }
  
  export interface Participant {
    id: number;
    username: string;
    email: string;
  }
  
  export interface ActivityRequest {
    name: string;
    description?: string;
    mode: 'FREE_INCREMENT' | 'PENALTY_BALANCE';
  }
  
  export interface ScoreRequest {
    userId: number;
    points: number;
  }
  
  export interface Score {
    id: number;
    activityId: number;
    userId: number;
    username: string;
    points: number;
    timestamp: string;
  }