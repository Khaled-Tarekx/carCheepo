import z from 'zod';
import { Roles } from './types';

const regexString = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createUserSchema = z.object({
	username: z.string({
		required_error: 'Username is required',
		invalid_type_error: 'Username must be a string',
	}),
	phone: z
		.string({
			required_error: 'phone is required',
			invalid_type_error: 'phone must be a string',
		})
		.min(9, {
			message: 'phone must be at least 9 characters long',
		})
		.max(13, {
			message: 'phone must be at most 13 characters long',
		}),

	country: z.string({
		required_error: 'country is required',
		invalid_type_error: 'country must be a string',
	}),
	city: z.string({
		required_error: 'city is required',
		invalid_type_error: 'city must be a string',
	}),
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string',
		})
		.email({ message: 'Invalid email address' })
		.regex(regexString),

	password: z.string({
		required_error: 'password is required',
		invalid_type_error: 'password must be a string',
	}),

	isLoggedIn: z
		.boolean({
			invalid_type_error: 'login state must be a boolean',
		})
		.default(false)
		.optional(),
	roles: z.nativeEnum(Roles).default(Roles.user).optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const loginSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string',
		})
		.email({ message: 'Invalid email address' })
		.regex(regexString),

	password: z
		.string({
			required_error: 'password is required',
			invalid_type_error: 'password must be a string',
		})
		.min(5, 'password cant be less than 6 characters')
		.max(255, 'password cant be less than 255 characters'),
});

export const refreshTokenSchema = z.object({
	refresh_token: z.string({
		required_error: 'refresh Token is required',
		invalid_type_error: 'refresh Token must be a string',
	}),
});

export const resetPasswordRequestSchema = z.object({
	email: z.string({
		required_error: 'email is required',
		invalid_type_error: 'email must be a string',
	}),
});

export const changePasswordSchema = z.object({
	oldPassword: z.string({
		required_error: 'old password is required',
		invalid_type_error: 'old password must be a string',
	}),
	password: z.string({
		required_error: 'password is required',
		invalid_type_error: 'password must be a string',
	}),
	confirmPassword: z.string({
		required_error: 'password is required',
		invalid_type_error: 'password must be a string',
	}),
});

export const resetPasswordSchema = z.object({
	token: z.string({
		required_error: 'token is required',
		invalid_type_error: 'token must be a string',
	}),
	password: z
		.string({
			required_error: 'password is required',
			invalid_type_error: 'password must be a string',
		})
		.min(6, 'password cant be less than 6 characters'),
	confirmPassword: z
		.string({
			required_error: 'confirm password is required',
			invalid_type_error: 'confirm password must be a string',
		})
		.min(6, 'password cant be less than 6 characters'),
});

export const verfifyResetPasswordSchema = z.object({
	resetCode: z.string({
		required_error: 'reset code is required',
		invalid_type_error: 'reset code must be a string',
	}),
});
