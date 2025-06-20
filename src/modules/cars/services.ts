import { Car } from './models';
import {
	findResourceById,
	validateObjectIds,
	checkResource,
	isResourceOwner,
} from '../../utills/helpers';

import type { createCarDTO, updateCarDTO } from './types';
import {
	CarCreationFailed,
	CarDeletionFailed,
	CarNotFound,
	CarUpdateFailed,
} from './errors/cause';
import ApiFeatures from '../../utills/api-features';
import { LoginError } from '../auth/errors/cause';

export const getUserCars = async (userId: string) => {
	validateObjectIds([userId]);
	const apiFeatures = new ApiFeatures(Car.find({ seller: userId }))
		.sort()
		.paginate();
	return apiFeatures.mongooseQuery.exec();
};

export const getCar = async (carId: string) => {
	validateObjectIds([carId]);
	const car = await findResourceById(Car, carId, CarNotFound);
	return car;
};

export const createCar = async (carData: createCarDTO) => {
	if (!carData.seller) {
		throw new LoginError();
	}
	validateObjectIds([carData.seller]);
	const car = await Car.create({
		...carData,
		seller: carData.seller,
		images: carData.images,
	});

	checkResource(car, CarCreationFailed);

	return car;
};

export const updateCar = async (
	carData: updateCarDTO,
	carId: string,
	user: Express.User
) => {
	validateObjectIds([user.id]);
	const car = await findResourceById(Car, carId, CarNotFound);
	await isResourceOwner(user.id, car.seller.id);

	const carToUpdate = await Car.findByIdAndUpdate(
		car.id,
		{
			...carData,
		},
		{ new: true }
	);

	return checkResource(carToUpdate, CarUpdateFailed);
};

export const deleteCar = async (user: Express.User, carId: string) => {
	validateObjectIds([carId]);

	const car = await findResourceById(Car, carId, CarNotFound);
	await isResourceOwner(user.id, car.seller.id);

	const carToDelete = await Car.deleteOne(car._id);
	if (carToDelete.deletedCount === 0) {
		throw new CarDeletionFailed();
	}
	return car;
};
