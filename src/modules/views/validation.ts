import { mongooseId } from '../../utills/helpers';
import z from 'zod';

export const createReviewViewSchema = z.object({
	reviewId: mongooseId,
});
