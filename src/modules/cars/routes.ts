import { Router } from 'express';

import { validateResource } from '../../utills/middlewares';
import { createCarSchema, updateCarSchema } from './validation';

const router = Router();
import { authMiddleware } from '../auth/middleware';

import {
	getCar,
	getUserCars,
	createCar,
	updateCar,
	deleteCar,
} from './controllers';
import { uploadArray } from '../../setup/upload';

router.get('/', authMiddleware, getUserCars);
router
	.route('/:carId')
	.get(authMiddleware, getCar)
	.patch(
		authMiddleware,
		uploadArray('images'),
		validateResource({
			bodySchema: updateCarSchema,
		}),
		updateCar
	)
	.delete(authMiddleware, deleteCar);
router.post(
	'/',
	authMiddleware,
	uploadArray('images'),

	validateResource({ bodySchema: createCarSchema }),
	createCar
);

export default router;
