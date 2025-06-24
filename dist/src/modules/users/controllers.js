import { StatusCodes } from 'http-status-codes';
import * as UserServices from './services.js';
import { checkUser } from '../../utills/helpers.js';
import { BadRequestError, NotFound } from '../../custom-errors/main.js';
import { NotValidId } from '../../utills/errors/cause.js';
import { UserNotFound } from '../auth/errors/cause.js';
import { ReviewNotFound } from '../reviews/errors/cause.js';
import { UserDeletionFailed, UserUpdatingFailed } from './errors/cause.js';
import * as GlobalErrorMsg from '../../utills/errors/msg.js';
import * as ErrorMsg from './errors/msg.js';
import * as AuthErrorMsg from '../auth/errors/msg.js';
import * as ReviewErrorMsg from '../reviews/errors/msg.js';
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
export const getUserReviews = async (req, res, next) => {
    const user = req.user;
    try {
        checkUser(user);
        const userReviews = await UserServices.getUserReviews(user);
        res
            .status(StatusCodes.OK)
            .json({ data: userReviews, count: userReviews.length });
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
export const getUserReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const user = req.user;
    try {
        checkUser(user);
        const userReview = await UserServices.getUserReview(reviewId, user);
        res.status(StatusCodes.OK).json({ data: userReview });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof ReviewNotFound:
                return next(new NotFound(ReviewErrorMsg.ReviewNotFound));
            default:
                return next(err);
        }
    }
};
