import CarModel from './models';
import type { CreateCarInput, UpdateCarInput } from './types';

export const createCar = async (input: CreateCarInput) => {
    const car = await CarModel.create(input);
    return car;
};

export const updateCar = async (id: string, input: UpdateCarInput) => {
    const car = await CarModel.findByIdAndUpdate(id, input, { new: true });
    return car;
};

export const deleteCar = async (id: string) => {
    const car = await CarModel.findByIdAndDelete(id);
    return car;
};

export const getAllCars = async () => {
    const cars = await CarModel.find();
    return cars;
};

export const getCarById = async (id: string) => {
    const car = await CarModel.findById(id);
    return car;
};
