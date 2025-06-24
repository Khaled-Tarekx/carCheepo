import { StatusCodes } from 'http-status-codes';
import * as CommentServices from './services.js';
import { checkUser } from '../../utills/helpers.js';
import { CommentCreationFailed, CommentDeletionFailed, CommentNotFound, CommentUpdateFailed, CommentCountUpdateFailed, } from './errors/cause.js';
import * as ErrorMsg from './errors/msg.js';
import { AuthenticationError, BadRequestError, Conflict, NotFound, } from '../../custom-errors/main.js';
import { NotValidId } from '../../utills/errors/cause.js';
import * as GlobalErrorMsg from '../../utills/errors/msg.js';
import { UserNotFound } from '../auth/errors/cause.js';
export const getTaskComments = async (req, res, next) => {
    const { taskId } = req.query;
    try {
        const taskComments = await CommentServices.getTaskComments(taskId);
        res
            .status(StatusCodes.OK)
            .json({ data: taskComments, count: taskComments.length });
    }
    catch (err) {
        switch (true) {
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            default:
                return next(err);
        }
    }
};
export const getComment = async (req, res, next) => {
    const { commentId } = req.params;
    try {
        const comment = await CommentServices.getComment(commentId);
        res.status(StatusCodes.OK).json({ data: comment });
    }
    catch (err) {
        switch (true) {
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof CommentNotFound:
                return next(new NotFound(ErrorMsg.CommentNotFound));
            default:
                return next(err);
        }
    }
};
export const createComment = async (req, res, next) => {
    try {
        const { taskId, context } = req.body;
        const user = req.user;
        checkUser(user);
        const comment = await CommentServices.createComment({ taskId, context }, user);
        res.status(StatusCodes.CREATED).json({ data: comment });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof CommentCreationFailed:
                return next(new Conflict(ErrorMsg.CommentCreationFailed));
            case err instanceof CommentCountUpdateFailed:
                return next(new Conflict(ErrorMsg.CommentCountFailed));
            default:
                return next(err);
        }
    }
};
export const editComment = async (req, res, next) => {
    const { commentId } = req.params;
    const user = req.user;
    checkUser(user);
    const { context } = req.body;
    try {
        const comment = await CommentServices.editComment({ context }, commentId, user);
        res.status(StatusCodes.OK).json({ data: comment });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof CommentNotFound:
                return next(new NotFound(ErrorMsg.CommentNotFound));
            case err instanceof CommentUpdateFailed:
                return next(new Conflict(ErrorMsg.CommentEditingFailed));
            default:
                return next(err);
        }
    }
};
export const deleteComment = async (req, res, next) => {
    try {
        const user = req.user;
        checkUser(user);
        const { commentId } = req.params;
        const deletedComment = await CommentServices.deleteComment(user, commentId);
        res.status(StatusCodes.OK).json({ data: deletedComment });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof CommentNotFound:
                return next(new NotFound(ErrorMsg.CommentNotFound));
            case err instanceof CommentCountUpdateFailed:
                return next(new Conflict(ErrorMsg.CommentCountFailed));
            case err instanceof CommentDeletionFailed:
                return next(new Conflict(ErrorMsg.CommentDeletionFailed));
            default:
                return next(err);
        }
    }
};
import * as ReplyServices from './services.js';
import { ReplyCountUpdateFailed, ReplyCreationFailed, ReplyDeletionFailed, ReplyNotFound, ReplyUpdateFailed, } from './errors/cause.js';
export const getReplies = async (req, res) => {
    const replies = await ReplyServices.getReplies(req.query);
    res.status(StatusCodes.OK).json({ data: replies, count: replies.length });
};
export const getCommentReplies = async (req, res, next) => {
    const { commentId } = req.query;
    const replies = await ReplyServices.getCommentReplies(commentId);
    res.status(StatusCodes.OK).json({ data: replies, count: replies.length });
};
export const getReply = async (req, res, next) => {
    const { replyId } = req.params;
    try {
        const reply = await ReplyServices.getReply(replyId);
        res.status(StatusCodes.OK).json({ data: reply });
    }
    catch (err) {
        if (err instanceof ReplyNotFound) {
            return next(new NotFound(ErrorMsg.ReplyNotFound));
        }
        else {
            return next(err);
        }
    }
};
export const createReply = async (req, res, next) => {
    const { commentId, parentReply, repliesOfReply, context } = req.body;
    try {
        const user = req.user;
        checkUser(user);
        const reply = await ReplyServices.createReply({ commentId, parentReply, repliesOfReply, context }, user);
        res.status(StatusCodes.CREATED).json({ data: reply });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof ReplyCreationFailed:
                return next(new Conflict(ErrorMsg.ReplyCreationFailed));
            case err instanceof ReplyCountUpdateFailed:
                return next(new Conflict(ErrorMsg.ReplyCountFailed));
            default:
                return next(err);
        }
    }
};
export const editReply = async (req, res, next) => {
    const { replyId } = req.params;
    const { context } = req.body;
    try {
        const user = req.user;
        checkUser(user);
        const editedReply = await ReplyServices.editReply({ context }, replyId, user);
        res.status(StatusCodes.OK).json({ data: editedReply });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof ReplyNotFound:
                return next(new NotFound(ErrorMsg.ReplyNotFound));
            case err instanceof ReplyUpdateFailed:
                return next(new Conflict(ErrorMsg.ReplyEditingFailed));
            default:
                return next(err);
        }
    }
};
export const deleteReply = async (req, res, next) => {
    try {
        const user = req.user;
        checkUser(user);
        const { replyId } = req.params;
        const deletedReply = await ReplyServices.deleteReply(user, replyId);
        res.status(StatusCodes.OK).json({ data: deletedReply });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof ReplyNotFound:
                return next(new NotFound(ErrorMsg.ReplyNotFound));
            case err instanceof ReplyCountUpdateFailed:
                return next(new Conflict(ErrorMsg.ReplyCountFailed));
            case err instanceof ReplyDeletionFailed:
                return next(new Conflict(ErrorMsg.ReplyDeletionFailed));
            default:
                return next(err);
        }
    }
};
