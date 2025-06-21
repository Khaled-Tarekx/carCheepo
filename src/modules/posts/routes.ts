import { Router } from 'express';

import { validateResource } from '../../utills/middlewares';
import { createPostSchema, editPostSchema } from './validation';

const router = Router();
import { authMiddleware } from '../auth/middleware';

import {
	getPost,
	getUserPosts,
	createPost,
	editPost,
	deletePost,
} from './controllers';
import { uploadArray } from '../../setup/upload';

router.get('/', authMiddleware, getUserPosts);
router
	.route('/:postId')
	.get(authMiddleware, getPost)
	.patch(
		authMiddleware,
		uploadArray('car.images'),
		validateResource({
			bodySchema: editPostSchema,
		}),
		editPost
	)
	.delete(authMiddleware, deletePost);
router.post(
	'/',
	authMiddleware,
	uploadArray('car.images'),

	validateResource({ bodySchema: createPostSchema }),
	createPost
);

export default router;
