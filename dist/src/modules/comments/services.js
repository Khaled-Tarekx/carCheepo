import { Comment } from './models.js';
import { findResourceById, validateObjectIds, checkResource, isResourceOwner, } from '../../utills/helpers.js';
import Task from '../tasks/models.js';
import { CommentCountUpdateFailed, CommentCreationFailed, CommentDeletionFailed, CommentNotFound, CommentUpdateFailed, } from './errors/cause.js';
import { CommentLike } from '../likes/models.js';
import ApiFeatures from '../../utills/api-features.js';
export const getTaskComments = async (taskId) => {
    validateObjectIds([taskId]);
    const apiFeatures = new ApiFeatures(Comment.find({ task: taskId }))
        .sort()
        .paginate();
    return apiFeatures.mongooseQuery.exec();
};
export const getComment = async (commentId) => {
    validateObjectIds([commentId]);
    const comment = await findResourceById(Comment, commentId, CommentNotFound);
    return comment;
};
export const createComment = async (commentData, user) => {
    const { taskId, context } = commentData;
    validateObjectIds([taskId]);
    const comment = await Comment.create({
        owner: user.id,
        task: taskId,
        context,
    });
    checkResource(comment, CommentCreationFailed);
    const task = await Task.findOneAndUpdate({ _id: comment.task._id }, {
        $inc: { commentCount: 1 },
    }, { new: true });
    checkResource(task, CommentCountUpdateFailed);
    return comment;
};
export const editComment = async (commentData, commentId, user) => {
    const { context } = commentData;
    validateObjectIds([commentId]);
    const comment = await findResourceById(Comment, commentId, CommentNotFound);
    await isResourceOwner(user.id, comment.owner._id);
    const commentToUpdate = await Comment.findByIdAndUpdate(comment.id, { context }, { new: true });
    return checkResource(commentToUpdate, CommentUpdateFailed);
};
export const deleteComment = async (user, commentId) => {
    validateObjectIds([commentId]);
    const comment = await findResourceById(Comment, commentId, CommentNotFound);
    await isResourceOwner(user.id, comment.owner._id);
    const task = await Task.findByIdAndUpdate(comment.task._id, {
        $inc: { commentCount: 1 },
    }, { new: true });
    checkResource(task, CommentCountUpdateFailed);
    const commentToDelete = await Comment.deleteOne(comment._id);
    if (commentToDelete.deletedCount === 0) {
        throw new CommentDeletionFailed();
    }
    await CommentLike.deleteMany({ comment: comment._id });
    return comment;
};
import { NotSameCommentOrNotFound, ReplyCountUpdateFailed, ReplyCreationFailed, ReplyDeletionFailed, ReplyNotFound, ReplyUpdateFailed, } from './errors/cause.js';
export const getReplies = async (query) => {
    const apiFeatures = new ApiFeatures(Comment.find({ parentReply: { $exists: false } }), query)
        .sort()
        .paginate();
    return apiFeatures.mongooseQuery.exec();
};
export const getCommentReplies = async (commentId) => {
    const apiFeatures = new ApiFeatures(Comment.find({ parent: commentId }).populate({
        path: 'replies',
    }))
        .sort()
        .paginate();
    return apiFeatures.mongooseQuery.exec();
};
export const getReply = async (replyId) => {
    validateObjectIds([replyId]);
    const reply = await findResourceById(Comment, replyId, ReplyNotFound);
    const populated_reply = reply.populate({
        path: 'replies',
    });
    return populated_reply;
};
export const createReply = async (replyData, user) => {
    const { commentId, parentReply, context } = replyData;
    let reply;
    reply = new Comment({
        parent: commentId,
        owner: user.id,
        context,
    });
    checkResource(reply, ReplyCreationFailed);
    const commentData = await Comment.findByIdAndUpdate(reply.parent?._id, {
        $inc: { replyCount: 1 },
    });
    checkResource(commentData, ReplyCountUpdateFailed);
    if (parentReply) {
        const parent = await Comment.findOne({
            _id: parentReply,
            comment: commentId,
        });
        checkResource(parent, NotSameCommentOrNotFound);
        parent.replies.push(reply);
        parent.replyCount++;
        await parent.save();
        reply.parent = parent._id;
    }
    await reply.save();
    return reply;
};
export const editReply = async (replyData, replyId, user) => {
    const { context } = replyData;
    validateObjectIds([replyId]);
    const reply = await findResourceById(Comment, replyId, ReplyNotFound);
    await isResourceOwner(user.id, reply.owner._id);
    const replyToUpdate = await Comment.findByIdAndUpdate(reply._id, { context }, { new: true });
    checkResource(replyToUpdate, ReplyUpdateFailed);
    return replyToUpdate;
};
export const deleteReply = async (user, replyId) => {
    validateObjectIds([replyId]);
    const reply = await findResourceById(Comment, replyId, ReplyNotFound);
    await isResourceOwner(user.id, reply.owner._id);
    const comment = await Comment.findByIdAndUpdate(reply.parent?._id, {
        $inc: { replyCount: -1 },
    }, { new: true });
    checkResource(comment, ReplyCountUpdateFailed);
    const replyToDelete = await reply.deleteOne();
    if (replyToDelete.deletedCount === 0) {
        throw new ReplyDeletionFailed();
    }
    if (reply.replies && reply.replies.length > 0) {
        await Comment.deleteMany({
            _id: { $in: reply.replies },
        });
    }
    if (reply.parent) {
        await Comment.findByIdAndUpdate(reply.parent, {
            $pull: { repliesOfReply: reply._id },
            $inc: { replyCount: -1 },
        });
    }
    if (reply.parent) {
        await Comment.findByIdAndUpdate(reply.parent, {
            $inc: { replyCount: -1 },
        });
    }
    return reply;
};
