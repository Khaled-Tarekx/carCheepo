import express from 'express';
import { validateResource } from '../../utills/middlewares';
import { createCarSchema, updateCarSchema } from './validation';
import { createCar, deleteCar, getAllCars, getCarById, updateCar } from './controllers';
import { authMiddleware } from '../auth/middleware';

const router = express.Router();

// Public routes
router.get('/', getAllCars);
router.get('/:id', getCarById);

// Protected routes
router.use(authMiddleware); // Protect routes below this line

router.post(
    '/',
    validateResource({ bodySchema: createCarSchema }),
    createCar
);

router.patch(
    '/:id',
    validateResource({ bodySchema: updateCarSchema }),
    updateCar
);

router.delete('/:id', deleteCar);

export default router;
