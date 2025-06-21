import z from 'zod';
import { updateCarSchema, createCarSchema } from '../cars/validation';

const editPostSchema = z.object({
	title: z.string().min(1).optional(),
	context: z.string().min(1).optional(),
	car: updateCarSchema,
});

const createPostSchema = z.object({
	title: z.string().min(1),
	context: z.string().min(30),
	car: createCarSchema,
});

export { editPostSchema, createPostSchema };
