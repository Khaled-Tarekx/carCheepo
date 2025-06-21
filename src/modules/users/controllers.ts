import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { type TypedRequestBody } from 'zod-express-middleware';
import { updateUserSchema } from './validations';
import * as UserServices from './services';
import { checkUser } from '../../utills/helpers';
import { BadRequestError, NotFound } from '../../custom-errors/main';
import { NotValidId } from '../../utills/errors/cause';
import { UserNotFound } from '../auth/errors/cause';
import { ReviewNotFound } from '../reviews/errors/cause';

import { UserDeletionFailed, UserUpdatingFailed } from './errors/cause';
import * as GlobalErrorMsg from '../../utills/errors/msg';
import * as ErrorMsg from './errors/msg';
import * as AuthErrorMsg from '../auth/errors/msg';
import * as ReviewErrorMsg from '../reviews/errors/msg';

export const getUsers = async (req: Request, res: Response) => {
	const user = req.user;
	checkUser(user);
	const users = await UserServices.getUsers(user);
	res.status(StatusCodes.OK).json({ data: users, count: users.length });
};

export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.params;
	try {
		const user = await UserServices.getUser(userId);
		res.status(StatusCodes.OK).json({ data: user });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof UserNotFound:
				return next(new NotFound(AuthErrorMsg.UserNotFound));
			default:
				return next(err);
		}
	}
};

export const updateUserInfo = async (
	req: TypedRequestBody<typeof updateUserSchema>,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;
	try {
		checkUser(user);
		const { email, username } = req.body;
		const updatedUser = await UserServices.updateUserInfo(
			{ email, username },
			user
		);

		res.status(StatusCodes.OK).json({ data: updatedUser });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new NotFound(GlobalErrorMsg.LoginFirst));
			case err instanceof UserUpdatingFailed:
				return next(new NotFound(ErrorMsg.UserUpdatingFailed));
			default:
				return next(err);
		}
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;
	try {
		checkUser(user);
		const deletedUser = await UserServices.deleteUser(user);
		res.status(StatusCodes.OK).json({ data: deletedUser });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new NotFound(GlobalErrorMsg.LoginFirst));
			case err instanceof UserDeletionFailed:
				return next(new NotFound(ErrorMsg.UserDeletionFailed));
			default:
				return next(err);
		}
	}
};

export const getUserReviews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;
	try {
		checkUser(user);
		const userReviews = await UserServices.getUserReviews(user);

		res
			.status(StatusCodes.OK)
			.json({ data: userReviews, count: userReviews.length });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new NotFound(GlobalErrorMsg.LoginFirst));
			default:
				return next(err);
		}
	}
};

export const getUserReview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { reviewId } = req.params;
	const user = req.user;
	try {
		checkUser(user);
		const userReview = await UserServices.getUserReview(reviewId, user);
		res.status(StatusCodes.OK).json({ data: userReview });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new NotFound(GlobalErrorMsg.LoginFirst));
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof ReviewNotFound:
				return next(new NotFound(ReviewErrorMsg.ReviewNotFound));
			default:
				return next(err);
		}
	}
};
