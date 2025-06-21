import type { z } from 'zod';
import type { createReviewLikeSchema } from './validation';

export type ReviewLikeDTO = z.infer<typeof createReviewLikeSchema>;
