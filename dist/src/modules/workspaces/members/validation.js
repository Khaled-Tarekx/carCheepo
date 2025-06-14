import { mongooseId } from '../../../utills/helpers.js';
import z from 'zod';
import { Role } from './types.js';
export const createMemberSchema = z.object({
    workspace: mongooseId,
    member: mongooseId,
    role: z.nativeEnum(Role).default(Role.member),
});
export const updateMemberSchema = z.object({
    role: z.nativeEnum(Role),
});
