export interface Notification {
  id: string;
  type: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

export interface UserNotificationsResponse {
  data: Notification[];
  count: number;
}