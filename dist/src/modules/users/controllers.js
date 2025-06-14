import { StatusCodes } from 'http-status-codes';
import * as UserServices from './services.js';
import { checkUser } from '../../utills/helpers.js';
import { BadRequestError, NotFound } from '../../custom-errors/main.js';
import { NotValidId } from '../../utills/errors/cause.js';
import { UserNotFound } from '../auth/errors/cause.js';
import { UserDeletionFailed, UserUpdatingFailed } from './errors/cause.js';
import * as GlobalErrorMsg from '../../utills/errors/msg.js';
import * as ErrorMsg from './errors/msg.js';
import * as AuthErrorMsg from '../auth/errors/msg.js';
import { CommentNotFound, ReplyNotFound } from '../comments/errors/cause.js';
import * as CommentErrorMsg from '../comments/errors/msg.js';
import * as TaskErrorMsg from '../tasks/errors/msg.js';
import { TaskNotFound } from '../tasks/errors/cause.js';
export const getUsers = async (req, res) => {
    const user = req.user;
    checkUser(user);
    const users = await UserServices.getUsers(user);
    res.status(StatusCodes.OK).json({ data: users, count: users.length });
};
export const getUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await UserServices.getUser(userId);
        res.status(StatusCodes.OK).json({ data: user });
    }
    catch (err) {
        switch (true) {
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof UserNotFound:
                return next(new NotFound(AuthErrorMsg.UserNotFound));
            default:
                return next(err);
        }
    }
};
export const updateUserInfo = async (req, res, next) => {
    const user = req.user;
    try {
        checkUser(user);
        const { email, username } = req.body;
        const updatedUser = await UserServices.updateUserInfo({ email, username }, user);
        res.status(StatusCodes.OK).json({ data: updatedUser });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            case err instanceof UserUpdatingFailed:
                return next(new NotFound(ErrorMsg.UserUpdatingFailed));
            default:
                return next(err);
        }
    }
};
export const deleteUser = async (req, res, next) => {
    const user = req.user;
    try {
        checkUser(user);
        const deletedUser = await UserServices.deleteUser(user);
        res.status(StatusCodes.OK).json({ data: deletedUser });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            case err instanceof UserDeletionFailed:
                return next(new NotFound(ErrorMsg.UserDeletionFailed));
            default:
                return next(err);
        }
    }
};
export const getUserReplies = async (req, res, next) => {
    const user = req.user;
    try {
        checkUser(user);
        const userReplies = await UserServices.getUserReplies(user);
        res
            .status(StatusCodes.OK)
            .json({ data: userReplies, count: userReplies.length });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            default:
                return next(err);
        }
    }
};
export const getUserReply = async (req, res, next) => {
    const { replyId } = req.params;
    const user = req.user;
    try {
        checkUser(user);
        const userReply = await UserServices.getUserReply(replyId, user);
        res.status(StatusCodes.OK).json({ data: userReply });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof ReplyNotFound:
                return next(new NotFound(CommentErrorMsg.ReplyNotFound));
            default:
                return next(err);
        }
    }
};
export const getUserComments = async (req, res, next) => {
    const user = req.user;
    try {
        checkUser(user);
        const userComments = await UserServices.getUserComments(user);
        res
            .status(StatusCodes.OK)
            .json({ data: userComments, count: userComments.length });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            default:
                return next(err);
        }
    }
};
export const getUserComment = async (req, res, next) => {
    const { commentId } = req.params;
    const user = req.user;
    try {
        checkUser(user);
        const userComment = await UserServices.getUserComment(commentId, user);
        res.status(StatusCodes.OK).json({ data: userComment });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof CommentNotFound:
                return next(new NotFound(CommentErrorMsg.CommentNotFound));
            default:
                return next(err);
        }
    }
};
export const getUserTasks = async (req, res, next) => {
    const user = req.user;
    try {
        checkUser(user);
        const tasks = await UserServices.getUserTasks(user);
        res.status(StatusCodes.OK).json({ data: tasks, count: tasks.length });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            default:
                return next(err);
        }
    }
};
export const getUserTask = async (req, res, next) => {
    const user = req.user;
    try {
        checkUser(user);
        const { taskId } = req.params;
        const task = await UserServices.getUserTask(user, taskId);
        res.status(StatusCodes.OK).json({ data: task });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof TaskNotFound:
                return next(new NotFound(TaskErrorMsg.TaskNotFound));
            default:
                return next(err);
        }
    }
};
