import { z } from 'zod';

export const createCarLikeSchema = z.object({
  carId: z.string().min(1, 'Car ID is required'),
});

export const deleteCarLikeSchema = z.object({
  likeId: z.string().min(1, 'Like ID is required'),
});

export type CreateCarLikeDTO = z.infer<typeof createCarLikeSchema>;
export type DeleteCarLikeDTO = z.infer<typeof deleteCarLikeSchema>;