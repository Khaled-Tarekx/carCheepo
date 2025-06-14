import { Router } from 'express';
import { getComment, getTaskComments, createComment, editComment, deleteComment, } from './controllers.js';
import { validateResource } from '../../utills/middlewares.js';
import { createCommentSchema, updateCommentSchema } from './validation.js';
const router = Router();
router.get('/', getTaskComments);
router
    .route('/:commentId')
    .get(getComment)
    .patch(validateResource({
    bodySchema: updateCommentSchema,
}), editComment)
    .delete(deleteComment);
router.post('/', validateResource({ bodySchema: createCommentSchema }), createComment);
import { getReply, getReplies, createReply, editReply, deleteReply, getCommentReplies, } from './controllers.js';
import { createReplySchema, updateReplySchema } from './validation.js';
router
    .route('/')
    .get(getReplies)
    .post(validateResource({ bodySchema: createReplySchema }), createReply);
router.get('/comments', getCommentReplies);
router
    .route('/:replyId')
    .get(getReply)
    .patch(validateResource({ bodySchema: updateReplySchema }), editReply)
    .delete(deleteReply);
export default router;
