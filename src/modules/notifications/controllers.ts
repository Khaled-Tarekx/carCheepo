import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUserNotifications } from './socket';

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get all notifications for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 count:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized
 */
export const getUserNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'User not authenticated'
      });
    }

    const notifications = await getUserNotifications(userId);
    
    res.status(StatusCodes.OK).json({
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   patch:
 *     tags:
 *       - Notifications
 *     summary: Mark a notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read"
 *                 notificationId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
export const markNotificationAsReadController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.params;
    
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'User not authenticated'
      });
    }

    // In a real implementation, you would update the notification status in Redis or database
    // For now, we'll just return a success response
    res.status(StatusCodes.OK).json({
      message: 'Notification marked as read',
      notificationId
    });
  } catch (error) {
    next(error);
  }
};