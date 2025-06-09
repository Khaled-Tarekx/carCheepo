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
import { MailFailedToSend } from '../tasks/errors/cause';
import { checkResource } from 'src/utills/helpers';
import { User } from '@supabase/supabase-js';

export const registerUser = async (
	req: TypedRequestBody<typeof createUserSchema>,
	res: Response,
	next: NextFunction
) => {
	const { username, email, password } = req.body;
	try {
		const user = await AuthServices.registerUser({
			username,
			email,
			password,
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

export const signInUser = async (
	req: TypedRequestBody<typeof loginSchema>,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;
	try {
		const data = await AuthServices.loginUser({ email, password });

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
