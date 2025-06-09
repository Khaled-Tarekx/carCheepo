import express from 'express';
import {
	changePassword,
	refreshSession,
	registerUser,
	requestResetPassword,
	resetPassword,
	signInUser,
	verifyResetCode,
} from './controllers';
import { validateResource } from '../../utills/middlewares';
import {
	loginSchema,
	createUserSchema,
	resetPasswordSchema,
	refreshTokenSchema,
	changePasswordSchema,
	verfifyResetPasswordSchema,
	resetPasswordRequestSchema,
} from './validation';
import { authMiddleware } from './middleware';

const router = express.Router();

router.post(
	'/register-user',
	validateResource({ bodySchema: createUserSchema }),
	registerUser
);
router.post(
	'/login-user',
	validateResource({ bodySchema: loginSchema }),
	signInUser
);
router.post(
	'/refresh-session',
	validateResource({ bodySchema: refreshTokenSchema }),
	refreshSession
);

router.post(
	'/request-reset-password',
	validateResource({ bodySchema: resetPasswordRequestSchema }),
	requestResetPassword
);

router.post(
	'/verify-reset-password',
	validateResource({ bodySchema: verfifyResetPasswordSchema }),
	verifyResetCode
);

router.patch(
	'/reset-password',
	validateResource({ bodySchema: resetPasswordSchema }),
	resetPassword
);

router.patch(
	'/change-password',
	authMiddleware,
	validateResource({ bodySchema: changePasswordSchema }),
	changePassword
);

export default router;
