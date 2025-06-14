import { StatusCodes } from 'http-status-codes';
import * as AuthServices from './services.js';
import { CodeVerificationFailed, PasswordHashingError, PasswordMismatchedConfirm, TokenVerificationFailed, UserNotFound, } from './errors/cause.js';
import { AuthenticationError, Conflict, NotFound, } from '../../custom-errors/main.js';
import * as ErrorMsg from './errors/msg.js';
import * as UserErrorMsg from '../users/errors/msg.js';
import { UserUpdatingFailed } from '../users/errors/cause.js';
import { MailFailedToSend } from '../tasks/errors/cause.js';
import { checkResource } from '../../utills/helpers.js';
/**
 * @swagger
 * /register-user:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Registration failed due to validation errors
 *       500:
 *         description: Server error
 */
export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = await AuthServices.registerUser({
            username,
            email,
            password,
        });
        res.status(StatusCodes.CREATED).json({ data: user });
    }
    catch (err) {
        switch (true) {
            case err instanceof PasswordHashingError:
                return next(new AuthenticationError(ErrorMsg.UserRegistraionFailed));
            case err instanceof UserNotFound:
                return next(new AuthenticationError(err.message));
            default:
                return next(err);
        }
    }
};
/**
 * @swagger
 * /login-user:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jwtToken:
 *                   type: string
 *                 userData:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     id:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=xyz; HttpOnly; Secure; SameSite=Strict
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 */
export const signInUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const data = await AuthServices.loginUser({ email, password }, res);
        res.status(StatusCodes.OK).json(data);
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(err.message));
            case err instanceof UserUpdatingFailed:
                return next(new Conflict(UserErrorMsg.UserUpdatingFailed));
            default:
                return next(err);
        }
    }
};
/**
 * @swagger
 * /refresh-session:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       201:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */
export const refreshSession = async (req, res, next) => {
    const { refresh_token } = req.body;
    try {
        const data = await AuthServices.refreshSession({ refresh_token });
        res.status(StatusCodes.CREATED).json(data);
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(err.message));
            case err instanceof TokenVerificationFailed:
                return next(new AuthenticationError(err.message));
            default:
                return next(err);
        }
    }
};
/**
 * @swagger
 * /request-reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Reset code sent successfully
 *       404:
 *         description: User not found
 */
export const requestResetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const data = await AuthServices.requestPasswordReset({ email });
        res.status(StatusCodes.CREATED).json(data);
    }
    catch (err) {
        switch (true) {
            case err instanceof MailFailedToSend:
                return next(new Conflict(err.message));
            case err instanceof UserNotFound:
                return next(new NotFound(err.message));
            default:
                return next(err);
        }
    }
};
/**
 * @swagger
 * /verify-reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify reset password code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetCode
 *             properties:
 *               resetCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reset code verified successfully
 *       401:
 *         description: Invalid or expired reset code
 */
export const verifyResetCode = async (req, res, next) => {
    const { resetCode } = req.body;
    try {
        const data = await AuthServices.verifyResetCode(resetCode);
        res.status(StatusCodes.CREATED).json(data);
    }
    catch (err) {
        switch (true) {
            case err instanceof CodeVerificationFailed:
                return next(new AuthenticationError(err.message));
            case err instanceof UserNotFound:
                return next(new NotFound(err.message));
            default:
                return next(err);
        }
    }
};
/**
 * @swagger
 * /reset-password:
 *   patch:
 *     tags:
 *       - Authentication
 *     summary: Reset password with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Password reset successful
 *       401:
 *         description: Invalid token or password mismatch
 */
export const resetPassword = async (req, res, next) => {
    const { token, password, confirmPassword } = req.body;
    try {
        const data = await AuthServices.resetPassword({
            token,
            password,
            confirmPassword,
        });
        res.status(StatusCodes.CREATED).json(data);
    }
    catch (err) {
        switch (true) {
            case err instanceof PasswordMismatchedConfirm:
                return next(new AuthenticationError(err.message));
            case err instanceof TokenVerificationFailed:
                return next(new AuthenticationError(err.message));
            case err instanceof UserNotFound:
                return next(new NotFound(err.message));
            default:
                return next(err);
        }
    }
};
/**
 * @swagger
 * /change-password:
 *   patch:
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     summary: Change password (requires authentication)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - password
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Password changed successfully
 *       401:
 *         description: Invalid old password or unauthorized
 */
export const changePassword = async (req, res, next) => {
    const { oldPassword, password, confirmPassword } = req.body;
    const user = req.user;
    checkResource(user, UserNotFound);
    try {
        const data = await AuthServices.changePassword(user.id, {
            oldPassword,
            password,
            confirmPassword,
        });
        res.status(StatusCodes.CREATED).json(data);
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(err.message));
            case err instanceof PasswordMismatchedConfirm:
                return next(new AuthenticationError(err.message));
            default:
                return next(err);
        }
    }
};
