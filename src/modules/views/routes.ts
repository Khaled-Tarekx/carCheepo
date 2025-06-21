import { Router } from 'express';
import {
	getReviewView,
	getReviewViews,
	createReviewView,
	getUserReviewViews,
} from './controllers';

import { createReviewViewSchema } from './validation';
import { validateResource } from '../../utills/middlewares';

const router = Router();
router.get('/reviews/:reviewId', getReviewViews);

router.get('/reviews/:viewId', getReviewView);

router.post(
	'/reviews',
	validateResource({ bodySchema: createReviewViewSchema }),
	createReviewView
);
router.get('/reviews/me/:reviewId', getUserReviewViews);

export default router;
