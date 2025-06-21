import z from 'zod';
import { mongooseId } from '../../utills/helpers.js';
import { CarType, currencyType, TransmissionType, fuelType, SafetyFeatures, InfotainmentFeatures, ComfortFeatures, PerformanceFeatures, ExteriorFeatures, } from './models.js';
const engineSchema = z.object({
    fuelType: z.nativeEnum(fuelType),
    capacity_liters: z.number().min(0),
    horsepower: z.number().min(0),
    cylinders: z.number().min(0),
    fuelcapacity: z.number().min(0),
});
const carFeaturesSchema = z.object({
    ['Safety & Driver Assistance']: z
        .array(z.nativeEnum(SafetyFeatures))
        .optional(),
    ['Infotainment & Connectivity']: z
        .array(z.nativeEnum(InfotainmentFeatures))
        .optional(),
    ['Comfort & Convenience']: z
        .array(z.nativeEnum(ComfortFeatures))
        .optional(),
    ['Performance & Efficiency']: z
        .array(z.nativeEnum(PerformanceFeatures))
        .optional(),
    ['Exterior & Lighting']: z.array(z.nativeEnum(ExteriorFeatures)).optional(),
});
const updateCarSchema = z.object({
    manifacture: z.string().min(1).optional(),
    model: z.number().optional(),
    brand: z.string().min(1).optional(),
    type: z.nativeEnum(CarType).optional(),
    price: z.number().min(0).optional(),
    currency: z.nativeEnum(currencyType).default(currencyType.USD),
    seats: z.number().min(2).optional(),
    transmission: z.nativeEnum(TransmissionType).optional(),
    color: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    images: z.array(z.string().min(1)).optional(),
    engine: engineSchema.optional(),
    mileage_km: z.string().min(1).optional(),
    isFeatured: z.boolean().optional().optional(),
    features: carFeaturesSchema.optional().optional(),
});
const createCarSchema = z.object({
    seller: mongooseId.optional(),
    manifacture: z.string().min(1),
    model: z.string(),
    brand: z.string().min(1),
    type: z.nativeEnum(CarType).optional(),
    price: z.number().min(0),
    currency: z.nativeEnum(currencyType).optional().default(currencyType.USD),
    seats: z.number().min(2).optional(),
    transmission: z.nativeEnum(TransmissionType).optional(),
    color: z.string().min(1),
    description: z.string().min(1).optional(),
    images: z.array(z.string().min(1)).optional(),
    engine: engineSchema.optional(),
    mileage_km: z.number().min(1),
    isFeatured: z.boolean().optional(),
    features: carFeaturesSchema.optional(),
});
export { updateCarSchema, createCarSchema };
