import {
	getModelForClass,
	prop,
	type Ref,
	modelOptions,
} from '@typegoose/typegoose';
import { UserSchema } from '../users/models';

enum CarType {
	Hatchback = 'Hatchback',
	Sedan = 'Sedan',
	SUV = 'SUV',
	Truck = 'Truck',
	Coupe = 'Coupe',
	Convertible = 'Convertible',
}

enum currencyType {
	USD = 'USD',
	EUR = 'EUR',
	EGP = 'EGP',
}

enum TransmissionType {
	Automatic = 'Automatic',
	SemiAutomatic = 'Semi-Automatic',
	Manual = 'Manual',
}

enum CarStatus {
	Pending = 'pending',
	Approved = 'approved',
	Rejected = 'rejected',
}

enum fuelType {
	Petrol = 'petrol',
	Diesel = 'diesel',
	Electric = 'electric',
	Hybrid = 'hybrid',
}

enum SafetyFeatures {
	TPMS = 'Tire Pressure Monitoring System (TPMS)',
	SIDE = 'Side',
	LDW = 'Lane Departure Warning (LDW)',
	REAR_CAMERA = 'Rearview Camera',
	TRACTION = 'Traction Control',
	ESC = 'Electronic Stability Control (ESC)',
	AEB = 'Automatic Emergency Braking (AEB)',
	CURTAIN = 'Curtain)',
	ABS = 'Anti-lock Braking System (ABS)',
	ACC = 'Adaptive Cruise Control (ACC)',
}

enum InfotainmentFeatures {
	VOICE = 'Voice Recognition',
	WIFI = 'Wi-Fi Hotspot',
	NAV = 'Navigation System',
	AUDIO = 'Premium Audio System',
}

enum ComfortFeatures {
	CRUISE = 'Cruise Control',
	REMOTE_START = 'Remote Engine Start',
	CUPHOLDERS = 'Cupholders',
	POWER_SEAT = "Power-Adjustable Driver's Seat",
	STORAGE = 'Ample Storage Compartments',
	WIRELESS_CHARGING = 'Wireless Phone Charging',
	CLIMATE = 'Automatic Climate Control',
	KEYLESS = 'Keyless Entry / Push-Button Start',
	WINDOWS_LOCKS = 'Power Windows & Locks',
	HEATED_SEATS = 'Heated Seats',
	STEERING_CONTROLS = 'Steering Wheel Controls',
}

enum PerformanceFeatures {
	ECO = 'Eco',
	SPORT = 'Sport)',
	AWD = 'All-Wheel Drive (AWD)',
	SELECTABLE_MODES = 'Selectable Drive Modes (e.g.',
	EFFICIENT_ENGINE = 'Fuel-Efficient Engine (e.g.',
}

enum ExteriorFeatures {
	SIDE_MIRRORS = 'Power Side Mirrors',
}

@modelOptions({ schemaOptions: { timestamps: true } })
class CarFeaturesSchema {
	@prop({ type: () => [String], enum: SafetyFeatures })
	['Safety & Driver Assistance']?: SafetyFeatures[];

	@prop({ type: () => [String], enum: InfotainmentFeatures })
	['Infotainment & Connectivity']?: InfotainmentFeatures[];

	@prop({ type: () => [String], enum: ComfortFeatures })
	['Comfort & Convenience']?: ComfortFeatures[];

	@prop({ type: () => [String], enum: PerformanceFeatures })
	['Performance & Efficiency']?: PerformanceFeatures[];

	@prop({ type: () => [String], enum: ExteriorFeatures })
	['Exterior & Lighting']?: ExteriorFeatures[];
}

@modelOptions({ schemaOptions: { timestamps: true } })
class EngineSchema {
	@prop({ required: true, enum: fuelType })
	fuelType!: string;
	@prop({ type: () => Number, required: true, min: 0 })
	capacity_liters!: number;
	@prop({ type: () => Number, required: true, min: 0 })
	horsepower!: number;
	@prop({ type: () => Number, required: true, min: 0 })
	cylinders!: number;
	@prop({ type: () => Number, required: true, min: 0 })
	fuelcapacity!: number;
}
@modelOptions({ schemaOptions: { timestamps: true } })
export class CarSchema {
	@prop({ ref: () => 'UserSchema', required: true })
	public seller!: Ref<UserSchema>;
	@prop({ type: () => String, required: true, minlength: 1 })
	public manifacture!: string;

	@prop({ type: () => Number, required: true })
	public model!: number;

	@prop({ type: () => Number, default: 0 })
	public likeCount!: number;

	@prop({ type: () => String, required: true, minlength: 1 })
	public brand!: string;
	@prop({ minlength: 1, enum: CarType })
	public type!: CarType;
	@prop({ type: () => Number, required: true, min: 0 })
	public price!: number;
	@prop({
		default: currencyType.USD,
		enum: currencyType,
	})
	public currency!: currencyType;
	@prop({ type: () => Number, min: 2 })
	public seats!: number;
	@prop({
		enum: TransmissionType,
	})
	public transmission!: TransmissionType;
	@prop({ type: () => String, minlength: 1 })
	public color!: string;
	@prop({ type: () => String, minlength: 1 })
	public description!: string;
	@prop({ type: () => [String], required: true, minlength: 1 })
	public images!: string[];
	@prop({ _id: false })
	engine!: EngineSchema;

	@prop({ type: () => String, required: true, minlength: 1 })
	public mileage_km!: string;
	@prop({ type: () => Boolean, default: false })
	public liked!: boolean;
	@prop({ type: () => Boolean, default: false })
	public isFeatured!: boolean; // home page featured car

	@prop({ type: () => CarFeaturesSchema, _id: false })
	public features!: CarFeaturesSchema;
}

const Car = getModelForClass(CarSchema);
export {
	Car,
	CarFeaturesSchema,
	EngineSchema,
	CarStatus,
	CarType,
	currencyType,
	TransmissionType,
	fuelType,
	SafetyFeatures,
	InfotainmentFeatures,
	ComfortFeatures,
	PerformanceFeatures,
	ExteriorFeatures,
};
