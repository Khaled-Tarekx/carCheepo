import { StatusCodes } from 'http-status-codes';
import { checkResource, checkUser } from '../../utills/helpers.js';
import { CarNotFound, CarDeletionFailed, CarCreationFailed, CarCountUpdateFailed, CarUpdateFailed, NoCarImageProvided, } from './errors/cause.js';
import * as ErrorMsg from './errors/msg.js';
import { AuthenticationError, BadRequestError, Conflict, NotFound, } from '../../custom-errors/main.js';
import { NotValidId } from '../../utills/errors/cause.js';
import * as GlobalErrorMsg from '../../utills/errors/msg.js';
import { LoginError, UserNotFound } from '../auth/errors/cause.js';
import * as CarServices from './services.js';
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
export const getUserCars = async (req, res, next) => {
    const user = req.user;
    try {
        checkUser(user);
        console.log('User ID:', user.id);
        const userCars = await CarServices.getUserCars(user.id);
        res
            .status(StatusCodes.OK)
            .json({ data: userCars, count: userCars.length });
    }
    catch (err) {
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
export const getCar = async (req, res, next) => {
    const { carId } = req.params;
    try {
        const car = await CarServices.getCar(carId);
        res.status(StatusCodes.OK).json({ data: car });
    }
    catch (err) {
        switch (true) {
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof CarNotFound:
                return next(new NotFound(ErrorMsg.CarNotFound));
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
export const createCar = async (req, res, next) => {
    try {
        const { brand, color, currency, description, engine, features, isFeatured, manifacture, mileage_km, model, price, seats, transmission, type, } = req.body;
        const user = req.user;
        checkUser(user);
        const images = Array.isArray(req.files) ? req.files : [];
        checkResource(images, NoCarImageProvided);
        const imagePaths = images.map((image) => image.path);
        const car = await CarServices.createCar({
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
            images: imagePaths,
        });
        res.status(StatusCodes.CREATED).json({ data: car });
    }
    catch (err) {
        switch (true) {
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof LoginError:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NoCarImageProvided:
                return next(new Conflict(ErrorMsg.NoCarImageProvided));
            case err instanceof CarCreationFailed:
                return next(new Conflict(ErrorMsg.CarCreationFailed));
            case err instanceof CarCountUpdateFailed:
                return next(new Conflict(ErrorMsg.CarCountFailed));
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
export const updateCar = async (req, res, next) => {
    const { carId } = req.params;
    const user = req.user;
    checkUser(user);
    const { currency, brand, color, description, engine, features, images, isFeatured, manifacture, mileage_km, model, price, seats, transmission, type, } = req.body;
    try {
        const car = await CarServices.updateCar({
            currency,
            brand,
            color,
            description,
            engine,
            features,
            images,
            isFeatured,
            manifacture,
            mileage_km,
            model,
            price,
            seats,
            transmission,
            type,
        }, carId, user);
        res.status(StatusCodes.OK).json({ data: car });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof CarNotFound:
                return next(new NotFound(ErrorMsg.CarNotFound));
            case err instanceof CarUpdateFailed:
                return next(new Conflict(ErrorMsg.CarEditingFailed));
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
export const deleteCar = async (req, res, next) => {
    try {
        const user = req.user;
        checkUser(user);
        const { carId } = req.params;
        const deletedCar = await CarServices.deleteCar(user, carId);
        res.status(StatusCodes.OK).json({ data: deletedCar });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            case err instanceof CarNotFound:
                return next(new NotFound(ErrorMsg.CarNotFound));
            case err instanceof CarDeletionFailed:
                return next(new Conflict(ErrorMsg.CarDeletionFailed));
            default:
                return next(err);
        }
    }
};
