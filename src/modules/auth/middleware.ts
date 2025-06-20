import { NextFunction, Request, Response } from 'express';
import { UnAuthorized, UserNotFound } from './errors/cause';

import { checkResource } from '../../utills/helpers';
import { getUserFromToken } from './utillities';

const access_secret = process.env.ACCESS_SECRET_KEY;

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return next(new UnAuthorized());
		}
		const token = authHeader.split(' ')[1];
		const user = await getUserFromToken(token, access_secret);
		checkResource(user, UserNotFound);
		req.user = {
			...user.toObject(),
			id: user._id.toString(),
		};
		next();
	} catch (error) {
		if (error instanceof Error) {
			return next(error);
		}
	}
};
