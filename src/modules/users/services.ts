import UserModel from './models';
import { Comment } from '../reviews/models';
import {
	findResourceById,
	validateObjectIds,
	checkResource,
} from '../../utills/helpers';

import type { updateUserDTO } from './types';
import { CommentNotFound } from '../reviews/errors/cause';
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

export const getUserComments = async (user: Express.User) => {
	return Comment.find({
		owner: user.id,
	});
};

export const getUserComment = async (
	commentId: string,
	user: Express.User
) => {
	validateObjectIds([commentId]);
	const comment = await Comment.findOne({
		_id: commentId,
		owner: user.id,
	});
	checkResource(comment, CommentNotFound);
	return comment;
};
