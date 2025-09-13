import { CarLike } from './models';
import { Car } from '../cars/models';
import {
  checkResource,
  findResourceById,
  validateObjectIds,
  isResourceOwner,
} from '../../utills/helpers';
import type { CreateCarLikeDTO } from './types';
import { CarNotFound } from '../cars/errors/cause';
import { sendNewLikeNotification } from '../notifications/services';
import { 
  CarLikeNotFoundError, 
  UserAlreadyLikedCarError, 
  CarLikeUpdateError,
  CarLikeDeletionError
} from './errors';

export const getCarLikes = async (carId: string) => {
  validateObjectIds([carId]);
  return CarLike.find({ car: carId });
};

export const getCarLike = async (likeId: string) => {
  validateObjectIds([likeId]);
  return findResourceById(CarLike, likeId, CarLikeNotFoundError);
};

export const getUserCarLike = async (user: Express.User, carId: string) => {
  validateObjectIds([carId]);
  const carLike = await CarLike.findOne({
    owner: user.id,
    car: carId,
  });
  return carLike;
};

export const createCarLike = async (
  likeData: CreateCarLikeDTO,
  user: Express.User
) => {
  const { carId } = likeData;
  validateObjectIds([carId]);

  // Check if the car exists
  const car = await findResourceById(Car, carId, CarNotFound);
  
  // Check if user already liked this car
  const existingLike = await CarLike.findOne({
    owner: user.id,
    car: carId,
  });
  
  if (existingLike) {
    throw new UserAlreadyLikedCarError();
  }

  // Create the like
  const carLike = await CarLike.create({
    owner: user.id,
    car: carId,
  });

  // Update the car's like count
  const updatedCar = await Car.findByIdAndUpdate(
    carId,
    { $inc: { likeCount: 1 } },
    { new: true }
  );
  
  if (!updatedCar) {
    throw new CarLikeUpdateError();
  }

  // Send notification to car owner
  if (car.seller.toString() !== user.id) {
    await sendNewLikeNotification(car.seller.toString(), carId, user.id);
  }

  return carLike;
};

export const deleteCarLike = async (
  likeId: string,
  user: Express.User
) => {
  validateObjectIds([likeId]);
  
  const carLikeToDelete = await findResourceById(
    CarLike,
    likeId,
    CarLikeNotFoundError
  );
  
  await isResourceOwner(user.id, carLikeToDelete.owner._id);
  
  // Update the car's like count
  const car = await Car.findByIdAndUpdate(
    carLikeToDelete.car._id,
    {
      $inc: { likeCount: -1 },
    },
    { new: true }
  );
  
  if (!car) {
    throw new CarLikeUpdateError();
  }
  
  // Delete the like
  const deletedLike = await CarLike.findByIdAndDelete(carLikeToDelete._id);
  
  if (!deletedLike) {
    throw new CarLikeDeletionError();
  }
  
  return carLikeToDelete;
};