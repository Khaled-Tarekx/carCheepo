import {
	changePasswordDTO,
	type createUserDTO,
	type loginDTO,
	refreshSessionDTO,
	resetpassworRequestdDTO,
	resetpasswordDTO,
} from './types';
import User from '../users/models';
import { checkResource } from '../../utills/helpers';
import {
	CodeVerificationFailed,
	PasswordHashingError,
	PasswordMismatchedConfirm,
	UserNotFound,
} from './errors/cause';
import { UserUpdatingFailed } from '../users/errors/cause';
import argon2 from 'argon2';
import {
	createTokenFromUser,
	ExpiresIn10Minutes,
	generateRandomCode,
	getUserFromToken,
	sendCustomEmail,
} from './utillities';
import { Response } from 'express';
const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

export const registerUser = async (userInput: createUserDTO) => {
	const hashedPassword = await argon2.hash(userInput.password);

	checkResource(hashedPassword, PasswordHashingError);
	const user = await User.create({
		...userInput,
		password: hashedPassword,
	});
	const userWithoutPassword = user.toObject();
	delete userWithoutPassword.password;

	checkResource(user, UserNotFound);
	return userWithoutPassword;
};

export const loginUser = async (logininput: loginDTO, res: Response) => {
	const { email, password } = logininput;
	const emailExists = await User.findOne({ email });
	if (!emailExists || !emailExists.password) {
		throw new UserNotFound();
	}

	const passwordCorrect = await argon2.verify(emailExists.password, password);

	if (!passwordCorrect) {
		throw new UserNotFound();
	}

	const updatedUser = await User.findOneAndUpdate(
		{ email: emailExists.email },
		{ isLoggedIn: true },
		{ new: true }
	);
	checkResource(updatedUser, UserUpdatingFailed);

	const jwtToken = await createTokenFromUser(
		updatedUser,
		accessSecretKey,
		'15m'
	);

	const refreshToken = await createTokenFromUser(
		updatedUser,
		refreshSecretKey,
		'90d'
	);
	// res.cookie('refreshToken', refreshToken, {
	// 	httpOnly: true,
	// 	secure: process.env.NODE_ENV === 'production',
	// 	sameSite: 'strict',
	// 	maxAge: 7 * 24 * 60 * 60 * 1000,
	// });

	const userData = {
		email: updatedUser.email,
		id: updatedUser._id,
		roles: updatedUser.roles,
	};

	return { jwtToken, refreshToken, userData };
};

export const refreshSession = async (tokenInput: refreshSessionDTO) => {
	const { refresh_token } = tokenInput;
	const user = await getUserFromToken(refresh_token, refreshSecretKey);
	const newAccessToken = await createTokenFromUser(
		user,
		accessSecretKey,
		'15m'
	);

	return {
		jwtToken: newAccessToken,
		userData: {
			id: user._id,
			email: user.email,
			roles: user.roles,
		},
	};
};

export const requestPasswordReset = async (
	resetPasswordInput: resetpassworRequestdDTO
) => {
	const { email } = resetPasswordInput;

	const user = await User.findOne({ email: email });

	checkResource(user, UserNotFound);
	const resetCode = generateRandomCode();
	user.resetPasswordCode = resetCode;
	user.resetPasswordExpire = ExpiresIn10Minutes;

	await user.save();
	try {
		await sendCustomEmail(
			user.email,
			'reset password request',
			`here is your 6 digit code to reset your password ${resetCode}`
		);
	} catch (error) {
		console.error('Error sending email:', error);
	}

	return {
		message: 'your reset code has been sent to your email',
		resetCode,
	}; // the reset code is returned just tfor api testing
};

export const verifyResetCode = async (resetCode: string) => {
	const user = await User.findOne({ resetPasswordCode: resetCode });

	checkResource(user, UserNotFound);
	const isExpired =
		user.resetPasswordExpire && user.resetPasswordExpire < new Date();

	if (isExpired) {
		user.resetPasswordCode = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();
		throw new CodeVerificationFailed();
	}
	const jwtToken = await createTokenFromUser(user, accessSecretKey, '15m');
	return { token: jwtToken, message: 'your reset code was correct' };
};

export const resetPassword = async (passwordInput: resetpasswordDTO) => {
	const { token, password, confirmPassword } = passwordInput;

	const user = await getUserFromToken(token, accessSecretKey);
	if (password !== confirmPassword) {
		throw new PasswordMismatchedConfirm();
	}
	const hashedPassword = await argon2.hash(password);
	user.password = hashedPassword;
	user.resetPasswordCode = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();
	return 'your password has been reset successfully';
};

export const changePassword = async (
	user_id: string,
	changePasswordInput: changePasswordDTO
) => {
	const { oldPassword, password, confirmPassword } = changePasswordInput;

	const user = await User.findById(user_id);
	checkResource(user, UserNotFound);
	checkResource(user.password, UserNotFound);

	const correctPassword = await argon2.verify(user.password, oldPassword);
	if (!correctPassword) {
		throw new UserNotFound();
	}
	if (password !== confirmPassword) {
		throw new PasswordMismatchedConfirm();
	}

	const hashedPassword = await argon2.hash(password);
	user.password = hashedPassword;
	await user.save();

	return 'password changed Successfully';
};
