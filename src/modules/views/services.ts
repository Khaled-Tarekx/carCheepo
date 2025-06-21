import { ReviewView } from './models';

import {
	checkResource,
	findResourceById,
	validateObjectIds,
	isResourceOwner,
} from '../../utills/helpers';
import type { ReviewViewDTO } from './types';
import { Review } from '../reviews/models';
import {
	ViewNotFound,
	ViewCountUpdateFailed,
	ViewCreationFailed,
} from './errors/cause';

export const getReviewViews = async (reviewId: string) => {
	validateObjectIds([reviewId]);
	return ReviewView.find({ review: reviewId });
};

export const getReviewView = async (viewId: string) => {
	validateObjectIds([viewId]);

	return findResourceById(ReviewView, viewId, ViewNotFound);
};

export const getUserReviewViews = async (user: Express.User) => {
	const userReviewView = await ReviewView.findOne({
		owner: user.id,
	});
	checkResource(userReviewView, ViewNotFound);
	return userReviewView;
};

export const createReviewView = async (
	reviewData: ReviewViewDTO,
	user: Express.User
) => {
	const { reviewId } = reviewData;
	validateObjectIds([reviewId]);

	const reviewView = await ReviewView.create({
		owner: user.id,
		review: reviewId,
	});
	const review = await Review.findByIdAndUpdate(reviewView.review._id, {
		$inc: { viewCount: 1 },
	});
	checkResource(review, ViewCountUpdateFailed);
	checkResource(reviewView, ViewCreationFailed);

	return reviewView;
};
