import express from 'express';
import { validateResource } from '../../utills/middlewares.js';
import { createCarSchema, updateCarSchema } from './validation.js';
import { createCar, deleteCar, getAllCars, getCarById, updateCar } from './controllers.js';
import { authMiddleware } from '../auth/middleware.js';
const router = express.Router();
// Public routes
router.get('/', getAllCars);
router.get('/:id', getCarById);
// Protected routes
router.use(authMiddleware); // Protect routes below this line
router.post('/', validateResource({ bodySchema: createCarSchema }), createCar);
router.patch('/:id', validateResource({ bodySchema: updateCarSchema }), updateCar);
router.delete('/:id', deleteCar);
export default router;
