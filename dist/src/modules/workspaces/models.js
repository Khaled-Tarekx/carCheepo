var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { getModelForClass, modelOptions, prop, } from '@typegoose/typegoose';
import { Type } from './types.js';
import { Role } from './members/types.js';
let MemberSchema = class MemberSchema {
    workspace;
    user;
    role;
};
__decorate([
    prop({ ref: () => WorkSpaceSchema, required: true }),
    __metadata("design:type", Object)
], MemberSchema.prototype, "workspace", void 0);
__decorate([
    prop({ ref: () => 'UserSchema', required: true }),
    __metadata("design:type", Object)
], MemberSchema.prototype, "user", void 0);
__decorate([
    prop({ type: () => String, enum: Role, default: Role.member }),
    __metadata("design:type", String)
], MemberSchema.prototype, "role", void 0);
MemberSchema = __decorate([
    modelOptions({ schemaOptions: { timestamps: true } })
], MemberSchema);
export { MemberSchema };
let WorkSpaceSchema = class WorkSpaceSchema {
    name;
    description;
    owner;
    type;
};
__decorate([
    prop({ type: () => String, required: true }),
    __metadata("design:type", String)
], WorkSpaceSchema.prototype, "name", void 0);
__decorate([
    prop({ type: () => String }),
    __metadata("design:type", String)
], WorkSpaceSchema.prototype, "description", void 0);
__decorate([
    prop({ ref: () => MemberSchema, required: true }),
    __metadata("design:type", Object)
], WorkSpaceSchema.prototype, "owner", void 0);
__decorate([
    prop({ type: () => String, enum: Type, default: Type.other }),
    __metadata("design:type", String)
], WorkSpaceSchema.prototype, "type", void 0);
WorkSpaceSchema = __decorate([
    modelOptions({ schemaOptions: { timestamps: true } })
], WorkSpaceSchema);
export { WorkSpaceSchema };
const Member = getModelForClass(MemberSchema);
const WorkSpace = getModelForClass(WorkSpaceSchema);
export { Member, WorkSpace };
