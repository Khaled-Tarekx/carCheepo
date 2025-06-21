import { mongooseId } from '../../utills/helpers';
import z from 'zod';

export const createReviewLikeSchema = z.object({
	reviewId: mongooseId,
});
