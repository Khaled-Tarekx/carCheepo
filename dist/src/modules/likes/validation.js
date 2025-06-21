import { mongooseId } from '../../utills/helpers.js';
import z from 'zod';
export const createReviewLikeSchema = z.object({
    reviewId: mongooseId,
});
