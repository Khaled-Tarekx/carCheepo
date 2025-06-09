import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {
	TokenVerificationFailed,
	UnAuthorized,
	UserNotFound,
} from './errors/cause';
import UserModel from '../users/models';
import { User } from '@supabase/supabase-js';
import { checkResource, findResourceById } from '../../utills/helpers';
import { get } from 'http';
import { getUserFromToken } from './utillities';

const access_secret = process.env.ACCESS_SECRET_KEY;

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
};
