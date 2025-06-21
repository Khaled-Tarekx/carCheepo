import UserModel from './models';
import { Review } from '../reviews/models';
import {
	findResourceById,
	validateObjectIds,
	checkResource,
} from '../../utills/helpers';

import type { updateUserDTO } from './types';
import { ReviewNotFound } from '../reviews/errors/cause';
import { UserDeletionFailed, UserUpdatingFailed } from './errors/cause';
import { UserNotFound } from '../auth/errors/cause';

export const getUsers = async (user: Express.User) => {
	return UserModel.find({}).select(' -password');
};

export const getUser = async (userId: string) => {
	validateObjectIds([userId]);

	return findResourceById(UserModel, userId, UserNotFound);
};

export const updateUserInfo = async (
	updateData: updateUserDTO,
	user: Express.User
) => {
	const updatedUser = await UserModel.findOneAndUpdate(
		{
			email: user.email,
		},
		{ ...updateData },
		{ new: true }
	);
	checkResource(updatedUser, UserUpdatingFailed);

	return updatedUser;
};

export const deleteUser = async (user: Express.User) => {
	const userToDelete = await UserModel.findOne({ email: user.email });
	checkResource(userToDelete, UserNotFound);

	const deletedUser = await userToDelete.deleteOne();
	if (deletedUser.deletedCount === 0) {
		throw new UserDeletionFailed();
	}
	return userToDelete;
};

export const getUserReviews = async (user: Express.User) => {
	return Review.find({
		owner: user.id,
	});
};

export const getUserReview = async (reviewId: string, user: Express.User) => {
	validateObjectIds([reviewId]);
	const review = await Review.findOne({
		_id: reviewId,
		owner: user.id,
	});
	checkResource(review, ReviewNotFound);
	return review;
};
