import { z } from 'zod';
import { CarSchema } from './models';
import { createCarSchema } from './validation';

export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = Partial<CreateCarInput>;

export interface CarDocument extends CarSchema {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
