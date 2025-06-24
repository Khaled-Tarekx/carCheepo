import { StatusCodes } from 'http-status-codes';
import * as CommentLikeServices from './comment.services.js';
import { checkUser } from '../../utills/helpers.js';
import { LikeCountUpdateFailed, LikeCreationFailed, LikeNotFound, UnLikeFailed, } from './errors/cause.js';
import { UserNotFound } from '../auth/errors/cause.js';
import { AuthenticationError, BadRequestError, Conflict, NotFound, } from '../../custom-errors/main.js';
import { NotResourceOwner, NotValidId } from '../../utills/errors/cause.js';
import * as GlobalErrorMsg from '../../utills/errors/msg.js';
import * as ErrorMsg from './errors/msg.js';
export const getCommentLikes = async (req, res) => {
    const { commentId } = req.params;
    const commentLikes = await CommentLikeServices.getCommentLikes(commentId);
    res
        .status(StatusCodes.OK)
        .json({ data: commentLikes, count: commentLikes.length });
};
export const getUserCommentLike = async (req, res, next) => {
    try {
        const user = req.user;
        checkUser(user);
        const userCommentLike = await CommentLikeServices.getUserCommentLike(user);
        res.status(StatusCodes.OK).json({ data: userCommentLike });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof LikeNotFound:
                return next(new NotFound(ErrorMsg.LikeCreationFailed));
            default:
                return next(err);
        }
    }
};
export const createCommentLike = async (req, res, next) => {
    try {
        const user = req.user;
        checkUser(user);
        const { commentId } = req.body;
        const commentLike = await CommentLikeServices.createCommentLike({ commentId }, user);
        res.status(StatusCodes.CREATED).json({ data: commentLike });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof LikeCountUpdateFailed:
                return next(new NotFound(ErrorMsg.ResourceLikeCountFailed));
            case err instanceof LikeCreationFailed:
                return next(new Conflict(ErrorMsg.LikeCreationFailed));
            default:
                return next(err);
        }
    }
};
export const deleteCommentLike = async (req, res, next) => {
    try {
        const user = req.user;
        checkUser(user);
        const { likeId } = req.params;
        const deletedCommentLike = await CommentLikeServices.deleteCommentLike(likeId, user);
        res.status(StatusCodes.OK).json({ data: deletedCommentLike });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof LikeCountUpdateFailed:
                return next(new NotFound(ErrorMsg.ResourceLikeCountFailed));
            case err instanceof LikeCreationFailed:
                return next(new Conflict(ErrorMsg.LikeCreationFailed));
            case err instanceof UnLikeFailed:
                return next(new Conflict(ErrorMsg.UnlikeFailed));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof NotResourceOwner:
                return next(new AuthenticationError(GlobalErrorMsg.NotResourceOwner));
            default:
                return next(err);
        }
    }
};
