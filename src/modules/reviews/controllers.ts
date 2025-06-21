import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { TypedRequestBody } from 'zod-express-middleware';
import type { createReviewSchema, editReviewSchema } from './validation';
import * as ReviewServices from './services';
import { checkUser } from '../../utills/helpers';
import {
	ReviewCreationFailed,
	ReviewDeletionFailed,
	ReviewNotFound,
	ReviewEditingFailed,
	ReviewCountUpdateFailed,
} from './errors/cause';
import * as ErrorMsg from './errors/msg';
import {
	AuthenticationError,
	BadRequestError,
	Conflict,
	NotFound,
} from '../../custom-errors/main';
import { NotValidId } from '../../utills/errors/cause';
import * as GlobalErrorMsg from '../../utills/errors/msg';
import { UserNotFound } from '../auth/errors/cause';
//  <{}, {}, {}, taskParam>

export const getPostReviews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { postId } = req.params;
	try {
		const postReviews = await ReviewServices.getPostReviews(postId);

		res
			.status(StatusCodes.OK)
			.json({ data: postReviews, count: postReviews.length });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			default:
				return next(err);
		}
	}
};

export const getReview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { reviewId } = req.params;
	try {
		const review = await ReviewServices.getReview(reviewId);
		res.status(StatusCodes.OK).json({ data: review });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof ReviewNotFound:
				return next(new NotFound(ErrorMsg.ReviewNotFound));
			default:
				return next(err);
		}
	}
};

export const createReview = async (
	req: TypedRequestBody<typeof createReviewSchema>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { postId, context } = req.body;
		const user = req.user;
		checkUser(user);
		const review = await ReviewServices.createReview(
			{ postId, context },
			user
		);
		res.status(StatusCodes.CREATED).json({ data: review });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof ReviewCreationFailed:
				return next(new Conflict(ErrorMsg.ReviewCreationFailed));

			case err instanceof ReviewCountUpdateFailed:
				return next(new Conflict(ErrorMsg.ReviewCountFailed));

			default:
				return next(err);
		}
	}
};

export const editReview = async (
	req: TypedRequestBody<typeof editReviewSchema>,
	res: Response,
	next: NextFunction
) => {
	const { reviewId } = req.params;
	const user = req.user;
	checkUser(user);
	const { context } = req.body;
	try {
		const review = await ReviewServices.editReview(
			{ context },
			reviewId,
			user
		);

		res.status(StatusCodes.OK).json({ data: review });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof ReviewNotFound:
				return next(new NotFound(ErrorMsg.ReviewNotFound));

			case err instanceof ReviewEditingFailed:
				return next(new Conflict(ErrorMsg.ReviewEditingFailed));
			default:
				return next(err);
		}
	}
};

export const deleteReview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		checkUser(user);
		const { reviewId } = req.params;
		const deletedReview = await ReviewServices.deleteReview(user, reviewId);

		res.status(StatusCodes.OK).json({ data: deletedReview });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof ReviewNotFound:
				return next(new NotFound(ErrorMsg.ReviewNotFound));

			case err instanceof ReviewCountUpdateFailed:
				return next(new Conflict(ErrorMsg.ReviewCountFailed));

			case err instanceof ReviewDeletionFailed:
				return next(new Conflict(ErrorMsg.ReviewDeletionFailed));
			default:
				return next(err);
		}
	}
};
