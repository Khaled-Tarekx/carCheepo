import { Router } from 'express';

import { validateResource } from '../../utills/middlewares';
import {
	createPostSchema,
	editPostSchema,
	uploadImagesToPostSchema,
} from './validation';

const router = Router();
import { authMiddleware } from '../auth/middleware';

import {
	getPost,
	getUserPosts,
	createPost,
	editPost,
	deletePost,
	uploadImagesToPost,
} from './controllers';
import { uploadArray } from '../../setup/upload';

router.get('/', authMiddleware, getUserPosts);
router
	.route('/:postId')
	.get(authMiddleware, getPost)
	.patch(
		authMiddleware,
		validateResource({
			bodySchema: editPostSchema,
		}),
		editPost
	)
	.delete(authMiddleware, deletePost);

router.route('/upload/:postId').patch(
	authMiddleware,
	uploadArray('images'),
	validateResource({
		bodySchema: uploadImagesToPostSchema,
	}),
	uploadImagesToPost
);

router.post(
	'/',
	authMiddleware,
	validateResource({ bodySchema: createPostSchema }),
	createPost
);

export default router;
