import { Review } from './models';
import {
	findResourceById,
	validateObjectIds,
	checkResource,
	isResourceOwner,
} from '../../utills/helpers';

import type { createReviewDTO, editReviewDTO } from './types';
import {
	ReviewCountUpdateFailed,
	ReviewCreationFailed,
	ReviewDeletionFailed,
	ReviewEditingFailed,
	ReviewNotFound,
} from './errors/cause';
import { ReviewLike } from '../likes/models';
import ApiFeatures from '../../utills/api-features';
import { Post } from '../posts/models';

export const getPostReviews = async (postId: string) => {
	validateObjectIds([postId]);
	const apiFeatures = new ApiFeatures(Review.find({ post: postId }))
		.sort()
		.paginate();
	return apiFeatures.mongooseQuery.exec();
};

export const getReview = async (reviewId: string) => {
	validateObjectIds([reviewId]);
	const review = await findResourceById(Review, reviewId, ReviewNotFound);
	return review;
};

export const createReview = async (
	reviewData: createReviewDTO,
	user: Express.User
) => {
	const { postId, context } = reviewData;
	validateObjectIds([postId]);
	const review = await Review.create({
		owner: user.id,
		post: postId,
		context,
	});

	checkResource(review, ReviewCreationFailed);

	const post = await Post.findOneAndUpdate(
		{ _id: review.post._id },
		{
			$inc: { reviewCount: 1 },
		},
		{ new: true }
	);
	checkResource(post, ReviewCountUpdateFailed);

	return review;
};

export const editReview = async (
	reviewData: editReviewDTO,
	reviewId: string,
	user: Express.User
) => {
	const { context } = reviewData;
	validateObjectIds([reviewId]);
	const review = await findResourceById(Review, reviewId, ReviewNotFound);
	await isResourceOwner(user.id, review.owner._id);

	const reviewToUpdate = await Review.findByIdAndUpdate(
		review.id,
		{ context },
		{ new: true }
	);

	return checkResource(reviewToUpdate, ReviewEditingFailed);
};

export const deleteReview = async (user: Express.User, reviewId: string) => {
	validateObjectIds([reviewId]);

	const review = await findResourceById(Review, reviewId, ReviewNotFound);
	await isResourceOwner(user.id, review.owner._id);

	const post = await Post.findByIdAndUpdate(
		review.post._id,
		{
			$inc: { reviewCount: 1 },
		},
		{ new: true }
	);
	checkResource(post, ReviewCountUpdateFailed);
	const reviewToDelete = await Review.deleteOne(review._id);
	if (reviewToDelete.deletedCount === 0) {
		throw new ReviewDeletionFailed();
	}
	await ReviewLike.deleteMany({ review: review._id });
	return review;
};
