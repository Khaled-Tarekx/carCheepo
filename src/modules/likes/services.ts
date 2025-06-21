import { ReviewLike } from './models';

import {
	checkResource,
	findResourceById,
	validateObjectIds,
	isResourceOwner,
} from '../../utills/helpers';
import type { ReviewLikeDTO } from './types';
import { Review } from '../reviews/models';
import {
	LikeCountUpdateFailed,
	LikeCreationFailed,
	LikeNotFound,
	UnLikeFailed,
} from './errors/cause';

export const getReviewLikes = async (reviewId: string) => {
	validateObjectIds([reviewId]);
	return ReviewLike.find({ review: reviewId });
};

export const getReviewLike = async (likeId: string) => {
	validateObjectIds([likeId]);

	return findResourceById(ReviewLike, likeId, LikeNotFound);
};

export const getUserReviewLike = async (user: Express.User) => {
	const userReviewLike = await ReviewLike.findOne({
		owner: user.id,
	});
	checkResource(userReviewLike, LikeNotFound);
	return userReviewLike;
};

export const createReviewLike = async (
	reviewData: ReviewLikeDTO,
	user: Express.User
) => {
	const { reviewId } = reviewData;
	validateObjectIds([reviewId]);

	const reviewLike = await ReviewLike.create({
		owner: user.id,
		comment: reviewId,
	});
	const review = await Review.findByIdAndUpdate(reviewLike.review._id, {
		$inc: { likeCount: 1 },
	});
	checkResource(review, LikeCountUpdateFailed);
	checkResource(reviewLike, LikeCreationFailed);

	return reviewLike;
};

export const deleteReviewLike = async (
	likeId: string,
	user: Express.User
) => {
	validateObjectIds([likeId]);
	const reviewLikeToDelete = await findResourceById(
		ReviewLike,
		likeId,
		LikeNotFound
	);
	await isResourceOwner(user.id, reviewLikeToDelete.owner._id);
	const review = await Review.findByIdAndUpdate(
		reviewLikeToDelete.review._id,
		{
			$inc: { likeCount: -1 },
		}
	);
	checkResource(review, LikeCountUpdateFailed);
	const likeToDelete = await ReviewLike.findByIdAndDelete(
		reviewLikeToDelete._id
	);
	if (!likeToDelete) {
		throw new UnLikeFailed();
	}
	return reviewLikeToDelete;
};
