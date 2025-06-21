import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createReviewViewSchema } from './validation';

import type { TypedRequestBody } from 'zod-express-middleware';
import * as ReviewViewServices from './services';
import { checkUser } from '../../utills/helpers';
import {
	ViewCountUpdateFailed,
	ViewCreationFailed,
	ViewNotFound,
} from './errors/cause';

import { UserNotFound } from '../auth/errors/cause';
import {
	AuthenticationError,
	BadRequestError,
	Conflict,
	NotFound,
} from '../../custom-errors/main';
import { NotResourceOwner, NotValidId } from '../../utills/errors/cause';
import * as GlobalErrorMsg from '../../utills/errors/msg';
import * as ErrorMsg from './errors/msg';

export const getReviewViews = async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const reviewViews = await ReviewViewServices.getReviewViews(reviewId);
	res
		.status(StatusCodes.OK)
		.json({ data: reviewViews, count: reviewViews.length });
};

export const getReviewView = async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const reviewView = await ReviewViewServices.getReviewView(reviewId);
	res.status(StatusCodes.OK).json({ data: reviewView });
};

export const getUserReviewViews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		checkUser(user);
		const userReviewViews = await ReviewViewServices.getUserReviewViews(user);
		res.status(StatusCodes.OK).json({ data: userReviewViews });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof ViewNotFound:
				return next(new NotFound(ErrorMsg.ViewCreationFailed));
			default:
				return next(err);
		}
	}
};

export const createReviewView = async (
	req: TypedRequestBody<typeof createReviewViewSchema>,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		checkUser(user);

		const { reviewId } = req.body;
		const reviewView = await ReviewViewServices.createReviewView(
			{ reviewId },
			user
		);
		res.status(StatusCodes.CREATED).json({ data: reviewView });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof ViewCountUpdateFailed:
				return next(new NotFound(ErrorMsg.ResourceViewCountFailed));
			case err instanceof ViewCreationFailed:
				return next(new Conflict(ErrorMsg.ViewCreationFailed));
			default:
				return next(err);
		}
	}
};
