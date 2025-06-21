import z from 'zod';
import { mongooseId } from '../../utills/helpers';

const createReviewSchema = z.object({
	context: z
		.string({
			required_error: 'you have to provide context for the review',
		})
		.min(1, 'length must be 1 char least'),

	postId: z.string({
		required_error: 'post is required',
		invalid_type_error: 'post must be a string',
	}),
});

const editReviewSchema = z.object({
	context: z
		.string({
			required_error: 'you have to provide context for the review',
		})
		.min(1, 'length must be 1 char least'),
});

export { createReviewSchema, editReviewSchema };
