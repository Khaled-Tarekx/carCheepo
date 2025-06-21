import type { z } from 'zod';
import type { createCarSchema, updateCarSchema } from './validation';

type createCarDTO = z.infer<typeof createCarSchema>;
type updateCarDTO = z.infer<typeof updateCarSchema>;

export type { createCarDTO, updateCarDTO };
