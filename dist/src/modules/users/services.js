import UserModel from './models.js';
import { Review } from '../reviews/models.js';
import { findResourceById, validateObjectIds, checkResource, } from '../../utills/helpers.js';
import { ReviewNotFound } from '../reviews/errors/cause.js';
import { UserDeletionFailed, UserUpdatingFailed } from './errors/cause.js';
import { UserNotFound } from '../auth/errors/cause.js';
export const getUsers = async (user) => {
    return UserModel.find({}).select(' -password');
};
export const getUser = async (userId) => {
    validateObjectIds([userId]);
    return findResourceById(UserModel, userId, UserNotFound);
};
export const updateUserInfo = async (updateData, user) => {
    const updatedUser = await UserModel.findOneAndUpdate({
        email: user.email,
    }, { ...updateData }, { new: true });
    checkResource(updatedUser, UserUpdatingFailed);
    return updatedUser;
};
export const deleteUser = async (user) => {
    const userToDelete = await UserModel.findOne({ email: user.email });
    checkResource(userToDelete, UserNotFound);
    const deletedUser = await userToDelete.deleteOne();
    if (deletedUser.deletedCount === 0) {
        throw new UserDeletionFailed();
    }
    return userToDelete;
};
export const getUserReviews = async (user) => {
    return Review.find({
        owner: user.id,
    });
};
export const getUserReview = async (reviewId, user) => {
    validateObjectIds([reviewId]);
    const review = await Review.findOne({
        _id: reviewId,
        owner: user.id,
    });
    checkResource(review, ReviewNotFound);
    return review;
};
