import User, { UserSchema } from '../users/models';
import jwt from 'jsonwebtoken';

import { compare, hash } from 'bcrypt';
import type { Document } from 'mongoose';
import {
	PasswordComparisionError,
	PasswordHashingError,
	TokenVerificationFailed,
	UserNotFound,
} from './errors/cause';
import emailQueue from '../tasks/queue';
import moment from 'moment';
import { MailFailedToSend } from '../tasks/errors/cause';
import { findResourceById } from '../../utills/helpers';

export const createTokenFromUser = async (
	user: Document & UserSchema,
	secret: string,
	expires?: string
) => {
	if (!user) {
		throw new UserNotFound();
	}

	return jwt.sign(
		{ id: user.id, email: user.email, roles: user.roles },
		secret,
		{
			expiresIn: expires,
		}
	);
};

export const getUserFromToken = async (token: string, secret: string) => {
	const decoded = jwt.verify(token, secret);

	if (!decoded || typeof decoded === 'string') {
		throw new TokenVerificationFailed();
	}
	const user = await findResourceById(User, decoded.id, UserNotFound);
	return user;
};

export const comparePassword = async (
	normalPassword: string,
	hashedPassword: string | undefined
): Promise<Boolean> => {
	if (!hashedPassword) {
		throw new PasswordComparisionError(
			'password doesnt match the user password'
		);
	}
	return compare(normalPassword, hashedPassword);
};

export const hashPassword = async (
	normalPassword: string,
	saltRounds: string | undefined
): Promise<string> => {
	if (!normalPassword) {
		throw new PasswordHashingError(
			'the hashing process of the password failed'
		);
	}
	return hash(normalPassword, Number(saltRounds));
};

export const generateRandomCode = (): string => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export const ExpiresIn10Minutes = new Date(Date.now() + 10 * 60 * 1000);

export const sendCustomEmail = async (
	toEmail: string,
	subject: string,
	message: string
) => {
	try {
		return emailQueue.add({
			from: `<"${process.env.ADMIN_USERNAME}">, <"${process.env.ADMIN_EMAIL}">`,
			to: toEmail,
			subject,
			text: message,
			date: moment(new Date()).format('DD MM YYYY hh:mm:ss'),
		});
	} catch (err: unknown) {
		console.error('Error sending email:', err);
		return new MailFailedToSend();
	}
};
