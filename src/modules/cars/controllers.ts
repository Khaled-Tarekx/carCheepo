/** @format */

import { NextFunction, Request, Response } from "express";
import { createCarSchema, updateCarSchema } from "./validation";
import * as CarServices from "./services";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../../custom-errors/main";
/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CarCard:
 *       type: object
 *       required: [brand, type, price, currency, details]
 *       properties:
 *         brand:
 *           type: string
 *         type:
 *           type: string
 *           enum: [Sedan, SUV, Convertible, Hatchback]
 *         price:
 *           type: number
 *           minimum: 0
 *           maximum: 100000
 *         currency:
 *           type: string
 *         details:
 *           type: object
 *           required: [transmission, capacity]
 *           properties:
 *             transmission:
 *               type: string
 *               enum: [Manual, Automatic, Semi-Automatic, IMT]
 *             capacity:
 *               type: string
 *               enum: [2 People, 4 People, 7 People]
 *     Engine:
 *       type: object
 *       required: [fuelType, fuelcapacity, capacity_liters, horsepower, cylinders]
 *       properties:
 *         fuelType:
 *           type: string
 *           enum: [electric, diesel, hybrid, petrol, GAS, hydrogen]
 *         fuelcapacity:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         capacity_liters:
 *           type: number
 *           minimum: 0.5
 *           maximum: 6
 *         horsepower:
 *           type: number
 *           minimum: 50
 *           maximum: 2000
 *         cylinders:
 *           type: number
 *           minimum: 4
 *           maximum: 12
 *     CarFeatures:
 *       type: object
 *       properties:
 *         safety:
 *           type: array
 *           items:
 *             type: string
 *         infotainment:
 *           type: array
 *           items:
 *             type: string
 *         comfort:
 *           type: array
 *           items:
 *             type: string
 *         performance:
 *           type: array
 *           items:
 *             type: string
 *         exterior:
 *           type: array
 *           items:
 *             type: string
 *     Location:
 *       type: object
 *       required: [city, country]
 *       properties:
 *         city:
 *           type: string
 *         country:
 *           type: string
 *     Color:
 *       type: object
 *       required: [exterior, interior]
 *       properties:
 *         exterior:
 *           type: string
 *         interior:
 *           type: string
 *     CreateCarInput:
 *       type: object
 *       required:
 *         - id
 *         - manifacture
 *         - model
 *         - car_card
 *         - phone
 *         - cost
 *         - engine
 *         - mileage_km
 *         - posted_at
 *         - car_features
 *         - location
 *         - color
 *       properties:
 *         id:
 *           type: string
 *         manifacture:
 *           type: string
 *         model:
 *           type: string
 *         car_card:
 *           $ref: '#/components/schemas/CarCard'
 *         phone:
 *           type: string
 *           pattern: '^\d{3}-\d{3}-\d{4}$'
 *           example: '123-456-7890'
 *         cost:
 *           type: number
 *           minimum: 1000
 *           maximum: 1000000
 *         description:
 *           type: string
 *         engine:
 *           $ref: '#/components/schemas/Engine'
 *         liked:
 *           type: boolean
 *           default: false
 *         mileage_km:
 *           type: number
 *           minimum: 500
 *           maximum: 500000
 *         posted_at:
 *           type: string
 *           format: date-time
 *           example: '2023-01-01T00:00:00Z'
 *         car_features:
 *           $ref: '#/components/schemas/CarFeatures'
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         color:
 *           $ref: '#/components/schemas/Color'
 *         performance:
 *           type: object
 *           properties:
 *             views:
 *               type: number
 *               minimum: 0
 *             likes:
 *               type: number
 *               minimum: 0
 *             clicks:
 *               type: number
 *               minimum: 0
 *           default:
 *             views: 0
 *             likes: 0
 *             clicks: 0
 *         status:
 *           type: string
 *           enum: [sold, pending, available]
 *           default: available
 */
/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCarInput'
 *           example:
 *             id: "ABC123456789"
 *             manifacture: "Toyota"
 *             model: "Camry"
 *             car_card:
 *               brand: "Toyota"
 *               type: "Sedan"
 *               price: 25000
 *               currency: "USD"
 *               details:
 *                 transmission: "Automatic"
 *                 capacity: "4 People"
 *             phone: "123-456-7890"
 *             cost: 25000
 *             description: "A reliable sedan with great fuel economy"
 *             engine:
 *               fuelType: "petrol"
 *               capacity_liters: 2.5
 *               horsepower: 200
 *               cylinders: 4
 *               fuelcapacity: 60
 *             mileage_km: 5000
 *             posted_at: "2023-01-01T00:00:00Z"
 *             car_features:
 *               safety: ["ABS", "Airbags"]
 *               infotainment: ["Bluetooth", "Navigation"]
 *               comfort: ["AC", "Heated Seats"]
 *               performance: ["Sport Mode", "Eco Mode"]
 *               exterior: ["Alloy Wheels", "Sunroof"]
 *             location:
 *               city: "New York"
 *               country: "USA"
 *             color:
 *               exterior: "Red"
 *               interior: "Black"
 *     responses:
 *       201:
 *         description: Car created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 */
export const createCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const car = await CarServices.createCar(req.body);
    res.status(StatusCodes.CREATED).json({ data: car });
  } catch (error) {
    next(error);
  }
};

export const updateCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const car = await CarServices.updateCar(req.params.id, req.body);
    if (!car) {
      throw new NotFound("Car not found");
    }
    res.status(StatusCodes.OK).json({ data: car });
  } catch (error) {
    next(error);
  }
};

export const deleteCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const car = await CarServices.deleteCar(req.params.id);
    if (!car) {
      throw new NotFound("Car not found");
    }
    res.status(StatusCodes.OK).json({ data: car });
  } catch (error) {
    next(error);
  }
};
/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get all cars
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
export const getAllCars = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cars = await CarServices.getAllCars();
    res.status(StatusCodes.OK).json({ data: cars });
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const car = await CarServices.getCarById(req.params.id);
    if (!car) {
      throw new NotFound("Car not found");
    }
    res.status(StatusCodes.OK).json({ data: car });
  } catch (error) {
    next(error);
  }
};
