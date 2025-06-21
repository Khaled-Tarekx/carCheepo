import z from 'zod';
import { updateCarSchema, createCarSchema } from '../cars/validation';
import { mongooseId } from '../../utills/helpers';

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

const uploadImagesToPostSchema = z.object({
	postId: mongooseId,
	car: z.object({
		images: z.array(z.string().url()).min(1),
	}),
});

export { editPostSchema, createPostSchema, uploadImagesToPostSchema };
