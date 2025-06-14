import User from '../users/models.js';
import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { PasswordComparisionError, PasswordHashingError, TokenVerificationFailed, UserNotFound, } from './errors/cause.js';
import emailQueue from '../tasks/queue.js';
import moment from 'moment';
import { MailFailedToSend } from '../tasks/errors/cause.js';
import { findResourceById } from '../../utills/helpers.js';
export const createTokenFromUser = async (user, secret, expires) => {
    if (!user) {
        throw new UserNotFound();
    }
    return jwt.sign({ id: user.id, email: user.email, roles: user.roles }, secret, {
        expiresIn: expires,
    });
};
export const getUserFromToken = async (token, secret) => {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded === 'string') {
        throw new TokenVerificationFailed();
    }
    const user = await findResourceById(User, decoded.id, UserNotFound);
    return user;
};
export const comparePassword = async (normalPassword, hashedPassword) => {
    if (!hashedPassword) {
        throw new PasswordComparisionError('password doesnt match the user password');
    }
    return compare(normalPassword, hashedPassword);
};
export const hashPassword = async (normalPassword, saltRounds) => {
    if (!normalPassword) {
        throw new PasswordHashingError('the hashing process of the password failed');
    }
    return hash(normalPassword, Number(saltRounds));
};
export const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
export const ExpiresIn10Minutes = new Date(Date.now() + 10 * 60 * 1000);
export const sendCustomEmail = async (toEmail, subject, message) => {
    try {
        return emailQueue.add({
            from: `<"${process.env.ADMIN_USERNAME}">, <"${process.env.ADMIN_EMAIL}">`,
            to: toEmail,
            subject,
            text: message,
            date: moment(new Date()).format('DD MM YYYY hh:mm:ss'),
        });
    }
    catch (err) {
        console.error('Error sending email:', err);
        return new MailFailedToSend();
    }
};
