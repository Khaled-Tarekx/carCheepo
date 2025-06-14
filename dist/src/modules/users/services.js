import UserModel from './models.js';
import { Comment } from '../comments/models.js';
import Task from '../tasks/models.js';
import { findResourceById, validateObjectIds, checkResource, } from '../../utills/helpers.js';
import { CommentNotFound, ReplyNotFound } from '../comments/errors/cause.js';
import { TaskNotFound } from '../tasks/errors/cause.js';
import { UserDeletionFailed, UserUpdatingFailed } from './errors/cause.js';
import { UserNotFound } from '../auth/errors/cause.js';
import { Member } from '../workspaces/models.js';
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
    await Member.deleteOne({ user: user.id });
    const deletedUser = await userToDelete.deleteOne();
    if (deletedUser.deletedCount === 0) {
        throw new UserDeletionFailed();
    }
    return userToDelete;
};
export const getUserReplies = async (user) => {
    return Comment.find({
        owner: user.id,
    });
};
export const getUserReply = async (replyId, user) => {
    validateObjectIds([replyId]);
    const reply = await Comment.findOne({
        _id: replyId,
        owner: user.id,
    });
    checkResource(reply, ReplyNotFound);
    return reply;
};
export const getUserComments = async (user) => {
    return Comment.find({
        owner: user.id,
    });
};
export const getUserComment = async (commentId, user) => {
    validateObjectIds([commentId]);
    const comment = await Comment.findOne({
        _id: commentId,
        owner: user.id,
    });
    checkResource(comment, CommentNotFound);
    return comment;
};
export const getUserTasks = async (user) => {
    return Task.find({ owner: user.id });
};
export const getUserTask = async (user, taskId) => {
    validateObjectIds([taskId]);
    const task = await Task.findOne({
        owner: user.id,
        _id: taskId,
    });
    checkResource(task, TaskNotFound);
    return task;
};
