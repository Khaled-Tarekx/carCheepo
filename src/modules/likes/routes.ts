import { Router } from 'express';
import {
	getReviewLikes,
	createReviewLike,
	getUserReviewLike,
	deleteReviewLike,
} from './controllers';

import { createReviewLikeSchema } from './validation';
import { validateResource } from '../../utills/middlewares';
import { authMiddleware } from '../auth/middleware';

const router = Router();
router.get('/reviews/:reviewId', authMiddleware, getReviewLikes);

router.delete('/reviews/:likeId', authMiddleware, deleteReviewLike);

router.post(
	'/reviews',
	authMiddleware,

	validateResource({ bodySchema: createReviewLikeSchema }),
	createReviewLike
);
router.get('/reviews/me/:reviewId', authMiddleware, getUserReviewLike);

export default router;
