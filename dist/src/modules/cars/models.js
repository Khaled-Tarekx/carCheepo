var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
let CarSchema = class CarSchema {
    manifacture;
    model;
    car_card;
    phone;
    description;
    engine;
    liked;
    mileage_km;
    car_features;
    location;
    color;
    performance;
    status;
    user;
};
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], CarSchema.prototype, "manifacture", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], CarSchema.prototype, "model", void 0);
__decorate([
    prop({
        type: () => Object,
        required: true
    }),
    __metadata("design:type", Object)
], CarSchema.prototype, "car_card", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], CarSchema.prototype, "phone", void 0);
__decorate([
    prop(),
    __metadata("design:type", String)
], CarSchema.prototype, "description", void 0);
__decorate([
    prop({
        type: () => Object,
        required: true
    }),
    __metadata("design:type", Object)
], CarSchema.prototype, "engine", void 0);
__decorate([
    prop({ default: false }),
    __metadata("design:type", Boolean)
], CarSchema.prototype, "liked", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", Number)
], CarSchema.prototype, "mileage_km", void 0);
__decorate([
    prop({
        type: () => Object
    }),
    __metadata("design:type", Object)
], CarSchema.prototype, "car_features", void 0);
__decorate([
    prop({
        type: () => Object,
    }),
    __metadata("design:type", Object)
], CarSchema.prototype, "location", void 0);
__decorate([
    prop({
        type: () => Object,
    }),
    __metadata("design:type", Object)
], CarSchema.prototype, "color", void 0);
__decorate([
    prop({
        type: () => Object,
        default: { views: 0, likes: 0, clicks: 0 }
    }),
    __metadata("design:type", Object)
], CarSchema.prototype, "performance", void 0);
__decorate([
    prop({ enum: ['sold', 'pending', 'available'], default: 'available' }),
    __metadata("design:type", String)
], CarSchema.prototype, "status", void 0);
__decorate([
    prop({
        type: () => Object
    }),
    __metadata("design:type", Object)
], CarSchema.prototype, "user", void 0);
CarSchema = __decorate([
    modelOptions({
        schemaOptions: {
            timestamps: true,
        },
        options: {
            allowMixed: Severity.ALLOW
        }
    })
], CarSchema);
export { CarSchema };
const CarModel = getModelForClass(CarSchema);
export default CarModel;
