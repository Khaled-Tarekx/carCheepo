import { Post } from './models';
import {
	findResourceById,
	validateObjectIds,
	checkResource,
	isResourceOwner,
} from '../../utills/helpers';

import type {
	createPublishedPostDTO,
	editPostDTO,
	uploadImagesToPostDTO,
} from './types';
import {
	PostCreationFailed,
	PostDeletionFailed,
	PostNotFound,
	PostEditingFailed,
} from './errors/cause';
import ApiFeatures from '../../utills/api-features';

export const getUserPosts = async (userId: string) => {
	validateObjectIds([userId]);
	const apiFeatures = new ApiFeatures(Post.find({ publisher: userId }))
		.sort()
		.paginate();
	return apiFeatures.mongooseQuery.exec();
};

export const getPost = async (postId: string) => {
	validateObjectIds([postId]);
	const post = await findResourceById(Post, postId, PostNotFound);
	return post;
};

export const createPost = async (
	postData: createPublishedPostDTO,
	userId: string
) => {
	validateObjectIds([userId]);
	const post = await Post.create({
		...postData,
		publisher: userId,
	});

	checkResource(post, PostCreationFailed);

	return post;
};

export const uploadImagesToPost = async (
	postData: uploadImagesToPostDTO,
	userId: string
) => {
	validateObjectIds([userId]);
	const post = await Post.findByIdAndUpdate(
		{ _id: postData.postId, publisher: userId },
		{
			car: {
				images: postData.car.images,
			},
		},
		{ new: true }
	);

	checkResource(post, PostCreationFailed);

	return post;
};
export const editCar = async (
	postData: editPostDTO,
	postId: string,
	user: Express.User
) => {
	validateObjectIds([user.id]);
	const post = await findResourceById(Post, postId, PostNotFound);
	await isResourceOwner(user.id, post.publisher.id);

	const postToEdit = await Post.findByIdAndUpdate(
		post.id,
		{
			...postData,
		},
		{ new: true }
	);

	return checkResource(postToEdit, PostEditingFailed);
};

export const deletePost = async (user: Express.User, postId: string) => {
	validateObjectIds([postId]);

	const post = await findResourceById(Post, postId, PostNotFound);
	await isResourceOwner(user.id, post.publisher.id);

	const postToDelete = await Post.deleteOne(post._id);
	if (postToDelete.deletedCount === 0) {
		throw new PostDeletionFailed();
	}
	return post;
};
