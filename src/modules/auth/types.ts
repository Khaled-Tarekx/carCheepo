import type { z } from 'zod';
import type {
	changePasswordSchema,
	createUserSchema,
	loginSchema,
	refreshTokenSchema,
	resetPasswordRequestSchema,
	resetPasswordSchema,
	verfifyResetPasswordSchema,
} from './validation';

export enum Roles {
	user = 'user',
	admin = 'admin',
}

export type changePasswordDTO = z.infer<typeof changePasswordSchema>;
export type resetpassworRequestdDTO = z.infer<
	typeof resetPasswordRequestSchema
>;
export type verfifyResetPasswordDTO = z.infer<
	typeof verfifyResetPasswordSchema
>;
export type resetpasswordDTO = z.infer<typeof resetPasswordSchema>;

export type refreshSessionDTO = z.infer<typeof refreshTokenSchema>;
export type createUserDTO = z.infer<typeof createUserSchema>;
export type loginDTO = z.infer<typeof loginSchema>;
