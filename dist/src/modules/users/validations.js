import { z } from 'zod';
export const updateUserSchema = z.object({
    username: z.string().optional(),
    email: z.string().email({ message: 'email is not correct' }).optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
});
