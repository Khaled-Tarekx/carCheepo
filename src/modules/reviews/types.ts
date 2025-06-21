import type { z } from 'zod';
import type { createReviewSchema, editReviewSchema } from './validation';

export type createReviewDTO = z.infer<typeof createReviewSchema>;
export type editReviewDTO = z.infer<typeof editReviewSchema>;
