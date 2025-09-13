import { Router } from 'express';
import { validateResource } from '../../utills/middlewares';
import { createCarLikeSchema, deleteCarLikeSchema } from './validation';
import { authMiddleware } from '../auth/middleware';
import {
  getCarLikes,
  createCarLike,
  deleteCarLike,
} from './controllers';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get likes for a specific car
router.get('/:carId', getCarLikes);

// Create a like for a car
router.post(
  '/',
  validateResource({ bodySchema: createCarLikeSchema }),
  createCarLike
);

// Delete a like
router.delete(
  '/:likeId',
  validateResource({ paramsSchema: deleteCarLikeSchema }),
  deleteCarLike
);

export default router;