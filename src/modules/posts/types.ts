import type { z } from 'zod';
import type { createPostSchema, editPostSchema } from './validation';

type createPostDTO = z.infer<typeof createPostSchema>;
type editPostDTO = z.infer<typeof editPostSchema>;
type createPublishedPostDTO = createPostDTO & {
	isPublished: boolean;
};
export type { createPostDTO, editPostDTO, createPublishedPostDTO };
