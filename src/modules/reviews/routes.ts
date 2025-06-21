import { Router } from 'express';
import {
	getReview,
	getPostReviews,
	createReview,
	editReview,
	deleteReview,
} from './controllers';
import { validateResource } from '../../utills/middlewares';
import { createReviewSchema, editReviewSchema } from './validation';
import { authMiddleware } from '../auth/middleware';

const router = Router();
router.get('/', authMiddleware, getPostReviews);
router
	.route('/:reviewId')
	.get(authMiddleware, getReview)
	.patch(
		authMiddleware,

		validateResource({
			bodySchema: editReviewSchema,
		}),
		editReview
	)
	.delete(authMiddleware, deleteReview);
router.post(
	'/',
	authMiddleware,

	validateResource({ bodySchema: createReviewSchema }),
	createReview
);

export default router;
