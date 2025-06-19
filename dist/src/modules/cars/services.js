import CarModel from './models.js';
export const createCar = async (input) => {
    const car = await CarModel.create(input);
    return car;
};
export const updateCar = async (id, input) => {
    const car = await CarModel.findByIdAndUpdate(id, input, { new: true });
    return car;
};
export const deleteCar = async (id) => {
    const car = await CarModel.findByIdAndDelete(id);
    return car;
};
export const getAllCars = async () => {
    const cars = await CarModel.find();
    return cars;
};
export const getCarById = async (id) => {
    const car = await CarModel.findById(id);
    return car;
};
