import type { z } from 'zod';
import type {
	createPostSchema,
	editPostSchema,
	uploadImagesToPostSchema,
} from './validation';

type createPostDTO = z.infer<typeof createPostSchema>;
type editPostDTO = z.infer<typeof editPostSchema>;
type uploadImagesToPostDTO = z.infer<typeof uploadImagesToPostSchema>;

type createPublishedPostDTO = createPostDTO & {
	isPublished: boolean;
};
export type {
	createPostDTO,
	editPostDTO,
	createPublishedPostDTO,
	uploadImagesToPostDTO,
};
