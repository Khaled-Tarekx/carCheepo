import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createReviewLikeSchema } from './validation';

import type { TypedRequestBody } from 'zod-express-middleware';
import * as ReviewLikeServices from './services';
import { checkUser } from '../../utills/helpers';
import {
	LikeCountUpdateFailed,
	LikeCreationFailed,
	LikeNotFound,
	UnLikeFailed,
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

export const getReviewLikes = async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const reviewLikes = await ReviewLikeServices.getReviewLikes(reviewId);
	res
		.status(StatusCodes.OK)
		.json({ data: reviewLikes, count: reviewLikes.length });
};

export const getUserReviewLike = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		checkUser(user);
		const userReviewLike = await ReviewLikeServices.getUserReviewLike(user);
		res.status(StatusCodes.OK).json({ data: userReviewLike });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof LikeNotFound:
				return next(new NotFound(ErrorMsg.LikeCreationFailed));
			default:
				return next(err);
		}
	}
};

export const createReviewLike = async (
	req: TypedRequestBody<typeof createReviewLikeSchema>,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		checkUser(user);

		const { reviewId } = req.body;
		const reviewLike = await ReviewLikeServices.createReviewLike(
			{ reviewId },
			user
		);
		res.status(StatusCodes.CREATED).json({ data: reviewLike });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof LikeCountUpdateFailed:
				return next(new NotFound(ErrorMsg.ResourceLikeCountFailed));
			case err instanceof LikeCreationFailed:
				return next(new Conflict(ErrorMsg.LikeCreationFailed));
			default:
				return next(err);
		}
	}
};

export const deleteReviewLike = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		checkUser(user);
		const { likeId } = req.params;
		const deletedReviewLike = await ReviewLikeServices.deleteReviewLike(
			likeId,
			user
		);

		res.status(StatusCodes.OK).json({ data: deletedReviewLike });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof LikeCountUpdateFailed:
				return next(new NotFound(ErrorMsg.ResourceLikeCountFailed));
			case err instanceof LikeCreationFailed:
				return next(new Conflict(ErrorMsg.LikeCreationFailed));
			case err instanceof UnLikeFailed:
				return next(new Conflict(ErrorMsg.UnlikeFailed));
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof NotResourceOwner:
				return next(new AuthenticationError(GlobalErrorMsg.NotResourceOwner));

			default:
				return next(err);
		}
	}
};
