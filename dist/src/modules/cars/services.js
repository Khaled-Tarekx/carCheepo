import { Car } from './models.js';
import { findResourceById, validateObjectIds, checkResource, isResourceOwner, } from '../../utills/helpers.js';
import { CarCreationFailed, CarDeletionFailed, CarNotFound, CarUpdateFailed, } from './errors/cause.js';
import ApiFeatures from '../../utills/api-features.js';
import { LoginError } from '../auth/errors/cause.js';
export const getUserCars = async (userId) => {
    validateObjectIds([userId]);
    const apiFeatures = new ApiFeatures(Car.find({ seller: userId }))
        .sort()
        .paginate();
    return apiFeatures.mongooseQuery.exec();
};
export const getCar = async (carId) => {
    validateObjectIds([carId]);
    const car = await findResourceById(Car, carId, CarNotFound);
    return car;
};
export const createCar = async (carData) => {
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
export const updateCar = async (carData, carId, user) => {
    validateObjectIds([user.id]);
    const car = await findResourceById(Car, carId, CarNotFound);
    await isResourceOwner(user.id, car.seller.id);
    const carToUpdate = await Car.findByIdAndUpdate(car.id, {
        ...carData,
    }, { new: true });
    return checkResource(carToUpdate, CarUpdateFailed);
};
export const deleteCar = async (user, carId) => {
    validateObjectIds([carId]);
    const car = await findResourceById(Car, carId, CarNotFound);
    await isResourceOwner(user.id, car.seller.id);
    const carToDelete = await Car.deleteOne(car._id);
    if (carToDelete.deletedCount === 0) {
        throw new CarDeletionFailed();
    }
    return car;
};
