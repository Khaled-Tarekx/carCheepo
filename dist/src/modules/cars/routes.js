import { Router } from 'express';
import { validateResource } from '../../utills/middlewares.js';
import { createCarSchema, updateCarSchema } from './validation.js';
const router = Router();
import { authMiddleware } from '../auth/middleware.js';
import { getCar, getUserCars, createCar, updateCar, deleteCar, } from './controllers.js';
import { uploadArray } from '../../setup/upload.js';
router.get('/', authMiddleware, getUserCars);
router
    .route('/:carId')
    .get(authMiddleware, getCar)
    .patch(authMiddleware, uploadArray('images'), validateResource({
    bodySchema: updateCarSchema,
}), updateCar)
    .delete(authMiddleware, deleteCar);
router.post('/', authMiddleware, uploadArray('images'), validateResource({ bodySchema: createCarSchema }), createCar);
export default router;
