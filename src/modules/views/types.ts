import type { z } from 'zod';
import type { createReviewViewSchema } from './validation';

export type ReviewViewDTO = z.infer<typeof createReviewViewSchema>;
