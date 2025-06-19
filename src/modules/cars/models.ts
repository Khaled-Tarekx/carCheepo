import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class CarSchema {


    @prop({ required: true })
    manifacture!: string;

    @prop({ required: true })
    model!: string;    @prop({
        type: () => Object,
        required: true
    })
    car_card!: {
        brand: string;
        type: 'Sedan' | 'SUV' | 'Convertible' | 'Hatchback';
        price: number;
        currency: string;
        details: {
            transmission: 'Manual' | 'Automatic' | 'Semi-Automatic' | 'IMT';
            capacity: '2 People' | '4 People' | '7 People';
        };
    };

    @prop({ required: true })
    phone!: string;



    @prop()
    description?: string;    @prop({
        type: () => Object,
        required: true
    })
    engine!: {
        fuelType: 'electric' | 'diesel' | 'hybrid' | 'petrol' | 'GAS' | 'hydrogen';
        capacity_liters: number;
        horsepower: number;
        cylinders: number;
        fuelcapacity: number;
    };

    @prop({ default: false })
    liked!: boolean;

    @prop({ required: true })
    mileage_km!: number;


    @prop({
        type: () => Object
    })
    car_features!: {
        safety: string[];
        infotainment: string[];
        comfort: string[];
        performance: string[];
        exterior: string[];
    };    @prop({
        type: () => Object,
    })
    location!: {
        city: string;
        country: string;
    };    @prop({
        type: () => Object,
    })
    color!: {
        exterior: string;
        interior: string;
    };    @prop({
        type: () => Object,
        default: { views: 0, likes: 0, clicks: 0 }
    })
    performance!: {
        views: number;
        likes: number;
        clicks: number;
    };

    @prop({ enum: ['sold', 'pending', 'available'], default: 'available' })
    status!: 'sold' | 'pending' | 'available';
    @prop({
        type: () => Object
    })
    user?: {
        id: number;
        dates: {
            start: Date;
            end: Date;
        };
        location: string;
        price: number;
        contact: {
            name: string;
            phone: string;
            email: string;
        };
        status: 'confirmed' | 'pending' | 'cancelled';
    };
}

const CarModel = getModelForClass(CarSchema);
export default CarModel;
