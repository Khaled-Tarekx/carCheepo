import express from 'express';
import { validateResource } from '../../utills/middlewares';
import {
	getUsers,
	getUser,
	deleteUser,
	updateUserInfo,
	getUserReview,
	getUserReviews,
} from './controllers';
import { updateUserSchema } from './validations';
import { changePasswordSchema } from '../auth/validation';
import { changePassword } from '../auth/controllers';
import { authMiddleware } from '../auth/middleware';

const router = express.Router();

router.get('/', getUsers);

router.route('/comments/me/:commentId').get(authMiddleware, getUserReview);
router.route('/comments/me').get(authMiddleware, getUserReviews);

router.get('/:userId', authMiddleware, getUser);

router.put(
	'/update-user',
	authMiddleware,
	validateResource({ bodySchema: updateUserSchema }),
	updateUserInfo
);

router.delete('/delete-user', authMiddleware, deleteUser);
export default router;
