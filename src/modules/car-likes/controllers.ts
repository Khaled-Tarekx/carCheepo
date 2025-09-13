import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as CarLikeServices from './services';
import { BadRequestError } from '../../custom-errors/main';
import { 
  UserAlreadyLikedCarError, 
  CarLikeNotFoundError,
  CarLikeError
} from './errors';

/**
 * @swagger
 * /car-likes/{carId}:
 *   get:
 *     tags:
 *       - Car Likes
 *     summary: Get all likes for a specific car
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to get likes for
 *     responses:
 *       200:
 *         description: A list of car likes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CarLike'
 *                 count:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Unauthorized
 */
export const getCarLikes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('getCarLikes called with params:', req.params);
    const { carId } = req.params;
    const carLikes = await CarLikeServices.getCarLikes(carId);
    res.status(StatusCodes.OK).json({ data: carLikes, count: carLikes.length });
  } catch (err) {
    console.log('Error in getCarLikes:', err);
    next(err);
  }
};

/**
 * @swagger
 * /car-likes:
 *   post:
 *     tags:
 *       - Car Likes
 *     summary: Like a car
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carId
 *             properties:
 *               carId:
 *                 type: string
 *                 description: ID of the car to like
 *     responses:
 *       201:
 *         description: Car liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarLike'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export const createCarLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new BadRequestError('User not authenticated'));
    }
    
    const carLike = await CarLikeServices.createCarLike(req.body, user);
    res.status(StatusCodes.CREATED).json({ data: carLike });
  } catch (err) {
    if (err instanceof UserAlreadyLikedCarError) {
      return next(new BadRequestError('You have already liked this car'));
    }
    next(err);
  }
};

/**
 * @swagger
 * /car-likes/{likeId}:
 *   delete:
 *     tags:
 *       - Car Likes
 *     summary: Unlike a car
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: likeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the like to remove
 *     responses:
 *       200:
 *         description: Car unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CarLike'
 *                 message:
 *                   type: string
 *                   example: "Like removed successfully"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export const deleteCarLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new BadRequestError('User not authenticated'));
    }
    
    const { likeId } = req.params;
    const carLike = await CarLikeServices.deleteCarLike(likeId, user);
    res.status(StatusCodes.OK).json({ data: carLike, message: 'Like removed successfully' });
  } catch (err) {
    if (err instanceof CarLikeNotFoundError) {
      return next(new BadRequestError('Car like not found'));
    }
    next(err);
  }
};