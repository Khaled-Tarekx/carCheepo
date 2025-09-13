import { Router } from 'express';
import { authMiddleware } from '../auth/middleware';
import {
  getUserNotificationsController,
  markNotificationAsReadController
} from './controllers';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user notifications
router.get('/', getUserNotificationsController);

// Mark notification as read
router.patch('/:notificationId/read', markNotificationAsReadController);

export default router;