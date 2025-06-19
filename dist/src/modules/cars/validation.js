import { z } from 'zod';
// Helper function to create a date schema that accepts both Date objects and ISO strings
const dateSchema = () => z.union([
    z.date(),
    z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Expected date in ISO format (e.g., '2023-01-01T00:00:00Z')"
    }).transform(val => new Date(val))
]);
const carTypesEnum = ['Sedan', 'SUV', 'Convertible', 'Hatchback'];
const transmissionTypesEnum = ['Manual', 'Automatic', 'Semi-Automatic', 'IMT'];
const capacityTypesEnum = ['2 People', '4 People', '7 People'];
const fuelTypesEnum = ['electric', 'diesel', 'hybrid', 'petrol', 'GAS', 'hydrogen'];
const statusEnum = ['sold', 'pending', 'available'];
const userStatusEnum = ['confirmed', 'pending', 'cancelled'];
export const createCarSchema = z.object({
    manifacture: z.string({
        required_error: 'Manufacture is required',
        invalid_type_error: 'Manufacture must be a string',
    }),
    model: z.string({
        required_error: 'Model is required',
        invalid_type_error: 'Model must be a string',
    }),
    car_card: z.object({
        type: z.enum(carTypesEnum),
        price: z.number().min(0).max(100000),
        currency: z.string(),
        details: z.object({
            transmission: z.enum(transmissionTypesEnum),
            capacity: z.enum(capacityTypesEnum)
        })
    }),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/),
    cost: z.number().min(1000).max(1000000),
    description: z.string().optional(),
    engine: z.object({
        fuelType: z.enum(fuelTypesEnum),
        capacity_liters: z.number().min(0.5).max(6),
        horsepower: z.number().min(50).max(2000),
        cylinders: z.number().min(4).max(12),
        fuelcapacity: z.number().min(0).max(100)
    }),
    liked: z.boolean().default(false),
    mileage_km: z.number().min(500).max(500000),
    posted_at: dateSchema(),
    updated_at: dateSchema().optional(),
    car_features: z.object({
        safety: z.array(z.string()),
        infotainment: z.array(z.string()),
        comfort: z.array(z.string()),
        performance: z.array(z.string()),
        exterior: z.array(z.string())
    }),
    location: z.object({
        city: z.string(),
        country: z.string()
    }),
    color: z.object({
        exterior: z.string(),
        interior: z.string()
    }),
    performance: z.object({
        views: z.number().min(0),
        likes: z.number().min(0),
        clicks: z.number().min(0)
    }).default({
        views: 0,
        likes: 0,
        clicks: 0
    }),
    status: z.enum(statusEnum).default('available'),
    user: z.object({
        id: z.number(),
        car: z.object({
            manifacture: z.string(),
            model: z.string(),
            year: z.number().min(1900).max(2025),
            image: z.string()
        }),
        dates: z.object({
            start: dateSchema(),
            end: dateSchema()
        }),
        location: z.string(),
        price: z.number(),
        contact: z.object({
            name: z.string(),
            phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/),
            email: z.string().email()
        }),
        status: z.enum(userStatusEnum)
    }).optional()
});
export const updateCarSchema = createCarSchema.partial();
