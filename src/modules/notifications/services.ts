import { sendNotificationToUser } from './socket';

// Notification types
export enum NotificationType {
  NEW_LIKE = 'NEW_LIKE',
  NEW_REVIEW = 'NEW_REVIEW',
  NEW_MESSAGE = 'NEW_MESSAGE',
  CAR_APPROVED = 'CAR_APPROVED',
  CAR_REJECTED = 'CAR_REJECTED'
}

// Send notification when a car gets a new like
export const sendNewLikeNotification = async (userId: string, carId: string, likerId: string) => {
  await sendNotificationToUser(userId, 'notification', {
    type: NotificationType.NEW_LIKE,
    message: 'Someone liked your car!',
    carId,
    likerId,
    timestamp: new Date().toISOString()
  });
};

// Send notification when a car gets a new review
export const sendNewReviewNotification = async (userId: string, carId: string, reviewerId: string, rating: number) => {
  await sendNotificationToUser(userId, 'notification', {
    type: NotificationType.NEW_REVIEW,
    message: `Someone reviewed your car with ${rating} stars!`,
    carId,
    reviewerId,
    rating,
    timestamp: new Date().toISOString()
  });
};

// Send notification when a car is approved
export const sendCarApprovedNotification = async (userId: string, carId: string, carTitle: string) => {
  await sendNotificationToUser(userId, 'notification', {
    type: NotificationType.CAR_APPROVED,
    message: `Your car "${carTitle}" has been approved!`,
    carId,
    timestamp: new Date().toISOString()
  });
};

// Send notification when a car is rejected
export const sendCarRejectedNotification = async (userId: string, carId: string, carTitle: string, reason: string) => {
  await sendNotificationToUser(userId, 'notification', {
    type: NotificationType.CAR_REJECTED,
    message: `Your car "${carTitle}" has been rejected. Reason: ${reason}`,
    carId,
    reason,
    timestamp: new Date().toISOString()
  });
};

// Send a general notification
export const sendGeneralNotification = async (userId: string, message: string, data?: any) => {
  await sendNotificationToUser(userId, 'notification', {
    type: 'GENERAL',
    message,
    data,
    timestamp: new Date().toISOString()
  });
};