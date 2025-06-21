import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { TypedRequestBody } from 'zod-express-middleware';
import type { createPostSchema, editPostSchema } from './validation';
import { checkResource, checkUser } from '../../utills/helpers';
import {
	PostNotFound,
	PostEditingFailed,
	PostCreationFailed,
	PostDeletionFailed,
} from './errors/cause';
import * as ErrorMsg from './errors/msg';
import {
	AuthenticationError,
	BadRequestError,
	Conflict,
	NotFound,
} from '../../custom-errors/main';
import { NotValidId } from '../../utills/errors/cause';
import * as GlobalErrorMsg from '../../utills/errors/msg';
import { NoCarImageProvided as NoCarImages } from '../cars/errors/msg';

import { LoginError, UserNotFound } from '../auth/errors/cause';
import * as PostServices from './services';
import { NoCarImageProvided } from '../cars/errors/cause';

/**
 * @swagger
 * /cars:
 *   get:
 *     tags:
 *       - Cars
 *     summary: Get all cars created by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *       401:
 *         description: Unauthorized
 */

export const getUserPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;
	try {
		checkUser(user);
		const userPosts = await PostServices.getUserPosts(user.id);

		res
			.status(StatusCodes.OK)
			.json({ data: userPosts, count: userPosts.length });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new NotFound(GlobalErrorMsg.LoginFirst));
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /cars/{carId}:
 *   get:
 *     tags:
 *       - Cars
 *     summary: Get details of a single car by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to retrieve
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Invalid car ID
 *       404:
 *         description: Car not found
 */

export const getPost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { postId } = req.params;
	try {
		const post = await PostServices.getPost(postId);
		res.status(StatusCodes.OK).json({ data: post });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof PostNotFound:
				return next(new NotFound(ErrorMsg.PostNotFound));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /cars:
 *   post:
 *     tags:
 *       - Cars
 *     summary: Create a new car
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - manifacture
 *               - model
 *               - price
 *               - transmission
 *               - type
 *               - color
 *               - description
 *               - mileage_km
 *               - engine
 *               - images
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Toyota
 *               manifacture:
 *                 type: string
 *                 example: Japan
 *               model:
 *                 type: number
 *                 example: 2022
 *               price:
 *                 type: number
 *                 example: 35000
 *               currency:
 *                 type: string
 *                 enum: [USD, EUR, EGP]
 *               seats:
 *                 type: number
 *                 example: 5
 *               transmission:
 *                 type: string
 *                 enum: [Automatic, Manual, Semi-Automatic]
 *               type:
 *                 type: string
 *                 enum: [Hatchback, Sedan, SUV, Truck, Coupe, Convertible]
 *               color:
 *                 type: string
 *                 example: Red
 *               description:
 *                 type: string
 *               mileage_km:
 *                 type: string
 *                 example: "120000"
 *               isFeatured:
 *                 type: boolean
 *               engine:
 *                 type: object
 *                 required:
 *                   - fuelType
 *                   - capacity_liters
 *                   - horsepower
 *                   - cylinders
 *                   - fuelcapacity
 *                 properties:
 *                   fuelType:
 *                     type: string
 *                     enum: [petrol, diesel, electric, hybrid]
 *                   capacity_liters:
 *                     type: number
 *                   horsepower:
 *                     type: number
 *                   cylinders:
 *                     type: number
 *                   fuelcapacity:
 *                     type: number
 *               features:
 *                 type: object
 *                 description: Optional features grouped by category
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car successfully created
 *       400:
 *         description: Bad request (validation errors)
 *       500:
 *         description: Internal server error
 */
export const createPost = async (
	req: TypedRequestBody<typeof createPostSchema>,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			title,
			context,
			car: {
				brand,
				color,
				currency,
				engine,
				features,
				isFeatured,
				manifacture,
				mileage_km,
				model,
				price,
				description,
				seats,
				transmission,
				type,
			},
		} = req.body;
		const user = req.user;
		checkUser(user);

		const post = await PostServices.createPost(
			{
				title,
				context,
				isPublished: true,
				car: {
					brand,
					color,
					currency,
					description,
					engine,
					features,
					isFeatured,
					manifacture,
					mileage_km,
					model,
					price,
					seats,
					transmission,
					type,
					seller: user.id,
				},
			},
			user.id
		);
		res.status(StatusCodes.CREATED).json({ data: post });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof LoginError:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof NoCarImageProvided:
				return next(new Conflict(NoCarImages));
			case err instanceof PostCreationFailed:
				return next(new Conflict(ErrorMsg.PostCreationFailed));
			default:
				return next(err);
		}
	}
};

export const uploadImagesToPost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		checkUser(user);
		const { postId } = req.params;
		const images = Array.isArray(req.files) ? req.files : [];
		checkResource(images, NoCarImageProvided);
		const imagePaths = images.map((image) => image.path);
		const post = await PostServices.uploadImagesToPost(
			{
				car: {
					images: imagePaths,
				},
				postId,
			},
			user.id
		);
		res.status(StatusCodes.CREATED).json({ data: post });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof LoginError:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof NoCarImageProvided:
				return next(new Conflict(NoCarImages));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /cars/{carId}:
 *   put:
 *     tags:
 *       - Cars
 *     summary: Update a car listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarUpdateInput'
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Car not found
 */

export const editPost = async (
	req: TypedRequestBody<typeof editPostSchema>,
	res: Response,
	next: NextFunction
) => {
	const { postId } = req.params;
	const user = req.user;
	checkUser(user);
	const {
		title,
		context,
		car: {
			currency,
			brand,
			color,
			description,
			engine,
			features,
			isFeatured,
			manifacture,
			mileage_km,
			model,
			price,
			seats,
			transmission,
			type,
		},
	} = req.body;
	try {
		const post = await PostServices.editCar(
			{
				title,
				context,
				car: {
					currency,
					brand,
					color,
					description,
					engine,
					features,
					isFeatured,
					manifacture,
					mileage_km,
					model,
					price,
					seats,
					transmission,
					type,
				},
			},
			postId,
			user
		);

		res.status(StatusCodes.OK).json({ data: post });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof PostNotFound:
				return next(new NotFound(ErrorMsg.PostNotFound));

			case err instanceof PostEditingFailed:
				return next(new Conflict(ErrorMsg.PostEditingFailed));
			default:
				return next(err);
		}
	}
};

/**
 * @swagger
 * /cars/{carId}:
 *   delete:
 *     tags:
 *       - Cars
 *     summary: Delete a car by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to delete
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Invalid car ID
 *       404:
 *         description: Car not found
 */

export const deletePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		checkUser(user);
		const { postId } = req.params;
		const deletedPost = await PostServices.deletePost(user, postId);

		res.status(StatusCodes.OK).json({ data: deletedPost });
	} catch (err: unknown) {
		switch (true) {
			case err instanceof UserNotFound:
				return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
			case err instanceof NotValidId:
				return next(new BadRequestError(GlobalErrorMsg.NotValidId));
			case err instanceof PostNotFound:
				return next(new NotFound(ErrorMsg.PostNotFound));
			case err instanceof PostDeletionFailed:
				return next(new Conflict(ErrorMsg.PostDeletionFailed));
			default:
				return next(err);
		}
	}
};
