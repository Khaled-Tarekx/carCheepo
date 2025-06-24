var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { getModelForClass, prop, modelOptions, } from '@typegoose/typegoose';
var CarType;
(function (CarType) {
    CarType["Hatchback"] = "Hatchback";
    CarType["Sedan"] = "Sedan";
    CarType["SUV"] = "SUV";
    CarType["Truck"] = "Truck";
    CarType["Coupe"] = "Coupe";
    CarType["Convertible"] = "Convertible";
})(CarType || (CarType = {}));
var currencyType;
(function (currencyType) {
    currencyType["USD"] = "USD";
    currencyType["EUR"] = "EUR";
    currencyType["EGP"] = "EGP";
})(currencyType || (currencyType = {}));
var TransmissionType;
(function (TransmissionType) {
    TransmissionType["Automatic"] = "Automatic";
    TransmissionType["SemiAutomatic"] = "Semi-Automatic";
    TransmissionType["Manual"] = "Manual";
})(TransmissionType || (TransmissionType = {}));
var CarStatus;
(function (CarStatus) {
    CarStatus["Pending"] = "pending";
    CarStatus["Approved"] = "approved";
    CarStatus["Rejected"] = "rejected";
})(CarStatus || (CarStatus = {}));
var fuelType;
(function (fuelType) {
    fuelType["Petrol"] = "petrol";
    fuelType["Diesel"] = "diesel";
    fuelType["Electric"] = "electric";
    fuelType["Hybrid"] = "hybrid";
})(fuelType || (fuelType = {}));
var SafetyFeatures;
(function (SafetyFeatures) {
    SafetyFeatures["TPMS"] = "Tire Pressure Monitoring System (TPMS)";
    SafetyFeatures["SIDE"] = "Side";
    SafetyFeatures["LDW"] = "Lane Departure Warning (LDW)";
    SafetyFeatures["REAR_CAMERA"] = "Rearview Camera";
    SafetyFeatures["TRACTION"] = "Traction Control";
    SafetyFeatures["ESC"] = "Electronic Stability Control (ESC)";
    SafetyFeatures["AEB"] = "Automatic Emergency Braking (AEB)";
    SafetyFeatures["CURTAIN"] = "Curtain)";
    SafetyFeatures["ABS"] = "Anti-lock Braking System (ABS)";
    SafetyFeatures["ACC"] = "Adaptive Cruise Control (ACC)";
})(SafetyFeatures || (SafetyFeatures = {}));
var InfotainmentFeatures;
(function (InfotainmentFeatures) {
    InfotainmentFeatures["VOICE"] = "Voice Recognition";
    InfotainmentFeatures["WIFI"] = "Wi-Fi Hotspot";
    InfotainmentFeatures["NAV"] = "Navigation System";
    InfotainmentFeatures["AUDIO"] = "Premium Audio System";
})(InfotainmentFeatures || (InfotainmentFeatures = {}));
var ComfortFeatures;
(function (ComfortFeatures) {
    ComfortFeatures["CRUISE"] = "Cruise Control";
    ComfortFeatures["REMOTE_START"] = "Remote Engine Start";
    ComfortFeatures["CUPHOLDERS"] = "Cupholders";
    ComfortFeatures["POWER_SEAT"] = "Power-Adjustable Driver's Seat";
    ComfortFeatures["STORAGE"] = "Ample Storage Compartments";
    ComfortFeatures["WIRELESS_CHARGING"] = "Wireless Phone Charging";
    ComfortFeatures["CLIMATE"] = "Automatic Climate Control";
    ComfortFeatures["KEYLESS"] = "Keyless Entry / Push-Button Start";
    ComfortFeatures["WINDOWS_LOCKS"] = "Power Windows & Locks";
    ComfortFeatures["HEATED_SEATS"] = "Heated Seats";
    ComfortFeatures["STEERING_CONTROLS"] = "Steering Wheel Controls";
})(ComfortFeatures || (ComfortFeatures = {}));
var PerformanceFeatures;
(function (PerformanceFeatures) {
    PerformanceFeatures["ECO"] = "Eco";
    PerformanceFeatures["SPORT"] = "Sport)";
    PerformanceFeatures["AWD"] = "All-Wheel Drive (AWD)";
    PerformanceFeatures["SELECTABLE_MODES"] = "Selectable Drive Modes (e.g.";
    PerformanceFeatures["EFFICIENT_ENGINE"] = "Fuel-Efficient Engine (e.g.";
})(PerformanceFeatures || (PerformanceFeatures = {}));
var ExteriorFeatures;
(function (ExteriorFeatures) {
    ExteriorFeatures["SIDE_MIRRORS"] = "Power Side Mirrors";
})(ExteriorFeatures || (ExteriorFeatures = {}));
let CarFeaturesSchema = class CarFeaturesSchema {
    ['Safety & Driver Assistance'];
    ['Infotainment & Connectivity'];
    ['Comfort & Convenience'];
    ['Performance & Efficiency'];
    ['Exterior & Lighting'];
};
__decorate([
    prop({ type: () => [String], enum: SafetyFeatures }),
    __metadata("design:type", Array)
], CarFeaturesSchema.prototype, 'Safety & Driver Assistance', void 0);
__decorate([
    prop({ type: () => [String], enum: InfotainmentFeatures }),
    __metadata("design:type", Array)
], CarFeaturesSchema.prototype, 'Infotainment & Connectivity', void 0);
__decorate([
    prop({ type: () => [String], enum: ComfortFeatures }),
    __metadata("design:type", Array)
], CarFeaturesSchema.prototype, 'Comfort & Convenience', void 0);
__decorate([
    prop({ type: () => [String], enum: PerformanceFeatures }),
    __metadata("design:type", Array)
], CarFeaturesSchema.prototype, 'Performance & Efficiency', void 0);
__decorate([
    prop({ type: () => [String], enum: ExteriorFeatures }),
    __metadata("design:type", Array)
], CarFeaturesSchema.prototype, 'Exterior & Lighting', void 0);
CarFeaturesSchema = __decorate([
    modelOptions({ schemaOptions: { timestamps: true } })
], CarFeaturesSchema);
let EngineSchema = class EngineSchema {
    fuelType;
    capacity_liters;
    horsepower;
    cylinders;
    fuelcapacity;
};
__decorate([
    prop({ required: true, enum: fuelType }),
    __metadata("design:type", String)
], EngineSchema.prototype, "fuelType", void 0);
__decorate([
    prop({ type: () => Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], EngineSchema.prototype, "capacity_liters", void 0);
__decorate([
    prop({ type: () => Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], EngineSchema.prototype, "horsepower", void 0);
__decorate([
    prop({ type: () => Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], EngineSchema.prototype, "cylinders", void 0);
__decorate([
    prop({ type: () => Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], EngineSchema.prototype, "fuelcapacity", void 0);
EngineSchema = __decorate([
    modelOptions({ schemaOptions: { timestamps: true } })
], EngineSchema);
let CarSchema = class CarSchema {
    seller;
    manifacture;
    model;
    likeCount;
    brand;
    type;
    price;
    currency;
    seats;
    transmission;
    color;
    description;
    images;
    engine;
    mileage_km;
    liked;
    isFeatured; // home page featured car
    features;
};
__decorate([
    prop({ ref: () => 'UserSchema', required: true }),
    __metadata("design:type", Object)
], CarSchema.prototype, "seller", void 0);
__decorate([
    prop({ type: () => String, required: true, minlength: 1 }),
    __metadata("design:type", String)
], CarSchema.prototype, "manifacture", void 0);
__decorate([
    prop({ type: () => Number, required: true }),
    __metadata("design:type", Number)
], CarSchema.prototype, "model", void 0);
__decorate([
    prop({ type: () => Number, default: 0 }),
    __metadata("design:type", Number)
], CarSchema.prototype, "likeCount", void 0);
__decorate([
    prop({ type: () => String, required: true, minlength: 1 }),
    __metadata("design:type", String)
], CarSchema.prototype, "brand", void 0);
__decorate([
    prop({ minlength: 1, enum: CarType }),
    __metadata("design:type", String)
], CarSchema.prototype, "type", void 0);
__decorate([
    prop({ type: () => Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], CarSchema.prototype, "price", void 0);
__decorate([
    prop({
        default: currencyType.USD,
        enum: currencyType,
    }),
    __metadata("design:type", String)
], CarSchema.prototype, "currency", void 0);
__decorate([
    prop({ type: () => Number, min: 2 }),
    __metadata("design:type", Number)
], CarSchema.prototype, "seats", void 0);
__decorate([
    prop({
        enum: TransmissionType,
    }),
    __metadata("design:type", String)
], CarSchema.prototype, "transmission", void 0);
__decorate([
    prop({ type: () => String, minlength: 1 }),
    __metadata("design:type", String)
], CarSchema.prototype, "color", void 0);
__decorate([
    prop({ type: () => String, minlength: 1 }),
    __metadata("design:type", String)
], CarSchema.prototype, "description", void 0);
__decorate([
    prop({ type: () => [String], required: true, minlength: 1 }),
    __metadata("design:type", Array)
], CarSchema.prototype, "images", void 0);
__decorate([
    prop({ _id: false }),
    __metadata("design:type", EngineSchema)
], CarSchema.prototype, "engine", void 0);
__decorate([
    prop({ type: () => String, required: true, minlength: 1 }),
    __metadata("design:type", String)
], CarSchema.prototype, "mileage_km", void 0);
__decorate([
    prop({ type: () => Boolean, default: false }),
    __metadata("design:type", Boolean)
], CarSchema.prototype, "liked", void 0);
__decorate([
    prop({ type: () => Boolean, default: false }),
    __metadata("design:type", Boolean)
], CarSchema.prototype, "isFeatured", void 0);
__decorate([
    prop({ type: () => CarFeaturesSchema, _id: false }),
    __metadata("design:type", CarFeaturesSchema)
], CarSchema.prototype, "features", void 0);
CarSchema = __decorate([
    modelOptions({ schemaOptions: { timestamps: true } })
], CarSchema);
export { CarSchema };
const Car = getModelForClass(CarSchema);
export { Car, CarFeaturesSchema, EngineSchema, CarStatus, CarType, currencyType, TransmissionType, fuelType, SafetyFeatures, InfotainmentFeatures, ComfortFeatures, PerformanceFeatures, ExteriorFeatures, };
