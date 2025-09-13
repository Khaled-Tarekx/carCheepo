import type { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
	changePasswordSchema,
	createUserSchema,
	loginSchema,
	resetPasswordSchema,
	refreshTokenSchema,
	resetPasswordRequestSchema,
	verfifyResetPasswordSchema,
} from './validation';
import type { TypedRequestBody } from 'zod-express-middleware';
import * as AuthServices from './services';
import {
	CodeVerificationFailed,
	PasswordHashingError,
	PasswordMismatchedConfirm,
	TokenVerificationFailed,
	UserNotFound,
} from './errors/cause';
import {
	AuthenticationError,
	Conflict,
	NotFound,
} from '../../custom-errors/main';
import * as ErrorMsg from './errors/msg';
import * as UserErrorMsg from '.././users/errors/msg';

import { UserUpdatingFailed } from '../users/errors/cause';
import { MailFailedToSend } from '../../utills/errors/cause';
import { checkResource } from '../../utills/helpers';

/**
 * @swagger
 * /register-user:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - phone
 *               - country
 *               - city
 *             properties:
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Registration failed due to validation errors
 *       500:
 *         description: Server error
 */

export const registerUser = async (
	req: TypedRequestBody<typeof createUserSchema>,
	res: Response,
	next: NextFunction
) => {
	const { username, email, password, country, city, phone } = req.body;
	try {
		const user = await AuthServices.registerUser({
			username,
			email,
			password,
			country,
			city,
			phone,
		});
		res.status(StatusCodes.CREATED).json({ data: user });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof PasswordHashingError:
				return next(new AuthenticationError(ErrorMsg.UserRegistraionFailed));
			case err instanceof UserNotFound:
				return next(new AuthenticationError(err.message));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /login-user:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jwtToken:
 *                   type: string
 *                 userData:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     id:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=xyz; HttpOnly; Secure; SameSite=Strict
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 */
export const signInUser = async (
	req: TypedRequestBody<typeof loginSchema>,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;
	try {
		// Validate email and password
		const data = await AuthServices.loginUser({ email, password }, res);

		res.status(StatusCodes.OK).json(data);
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new NotFound(err.message));
			case err instanceof UserUpdatingFailed:
				return next(new Conflict(UserErrorMsg.UserUpdatingFailed));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /refresh-session:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       201:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */
export const refreshSession = async (
	req: TypedRequestBody<typeof refreshTokenSchema>,
	res: Response,
	next: NextFunction
) => {
	const { refresh_token } = req.body;
	try {
		const data = await AuthServices.refreshSession({ refresh_token });

		res.status(StatusCodes.CREATED).json(data);
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new NotFound(err.message));
			case err instanceof TokenVerificationFailed:
				return next(new AuthenticationError(err.message));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /request-reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Reset code sent successfully
 *       404:
 *         description: User not found
 */

export const requestResetPassword = async (
	req: TypedRequestBody<typeof resetPasswordRequestSchema>,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body;
	try {
		const data = await AuthServices.requestPasswordReset({ email });

		res.status(StatusCodes.CREATED).json(data);
	} catch (err: unknown) {
		switch (true) {
			case err instanceof MailFailedToSend:
				return next(new Conflict(err.message));
			case err instanceof UserNotFound:
				return next(new NotFound(err.message));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /verify-reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify reset password code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetCode
 *             properties:
 *               resetCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reset code verified successfully
 *       401:
 *         description: Invalid or expired reset code
 */
export const verifyResetCode = async (
	req: TypedRequestBody<typeof verfifyResetPasswordSchema>,
	res: Response,
	next: NextFunction
) => {
	const { resetCode } = req.body;
	try {
		const data = await AuthServices.verifyResetCode(resetCode);

		res.status(StatusCodes.CREATED).json(data);
	} catch (err: unknown) {
		switch (true) {
			case err instanceof CodeVerificationFailed:
				return next(new AuthenticationError(err.message));
			case err instanceof UserNotFound:
				return next(new NotFound(err.message));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /reset-password:
 *   patch:
 *     tags:
 *       - Authentication
 *     summary: Reset password with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Password reset successful
 *       401:
 *         description: Invalid token or password mismatch
 */

export const resetPassword = async (
	req: TypedRequestBody<typeof resetPasswordSchema>,
	res: Response,
	next: NextFunction
) => {
	const { token, password, confirmPassword } = req.body;

	try {
		const data = await AuthServices.resetPassword({
			token,
			password,
			confirmPassword,
		});

		res.status(StatusCodes.CREATED).json(data);
	} catch (err: unknown) {
		switch (true) {
			case err instanceof PasswordMismatchedConfirm:
				return next(new AuthenticationError(err.message));
			case err instanceof TokenVerificationFailed:
				return next(new AuthenticationError(err.message));
			case err instanceof UserNotFound:
				return next(new NotFound(err.message));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /change-password:
 *   patch:
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     summary: Change password (requires authentication)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - password
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Password changed successfully
 *       401:
 *         description: Invalid old password or unauthorized
 */

export const changePassword = async (
	req: TypedRequestBody<typeof changePasswordSchema>,
	res: Response,
	next: NextFunction
) => {
	const { oldPassword, password, confirmPassword } = req.body;
	const user = req.user;
	checkResource(user, UserNotFound);
	try {
		const data = await AuthServices.changePassword(user.id, {
			oldPassword,
			password,
			confirmPassword,
		});

		res.status(StatusCodes.CREATED).json(data);
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(err.message));
			case err instanceof PasswordMismatchedConfirm:
				return next(new AuthenticationError(err.message));
			default:
				return next(err);
		}
	}
};
