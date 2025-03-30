// UUID type alias for clarity
export type UUID = string;

// Real-time event types
export type RealtimeEventType = 
  | 'vote_submitted'
  | 'player_joined'
  | 'player_left'
  | 'story_changed'
  | 'timer_updated'
  | 'role_changed';

export interface RealtimeEvent<T = any> {
  type: RealtimeEventType;
  roomId: UUID;
  data: T;
  timestamp: Date;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  timestamp: Date;
  success: boolean;
  error?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}