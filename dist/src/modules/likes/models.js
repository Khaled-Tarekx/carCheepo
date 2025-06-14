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
let CommentLikeSchema = class CommentLikeSchema {
    comment;
    owner;
};
__decorate([
    prop({ ref: () => 'CommentSchema', required: true }),
    __metadata("design:type", Object)
], CommentLikeSchema.prototype, "comment", void 0);
__decorate([
    prop({ ref: () => 'UserSchema', required: true }),
    __metadata("design:type", Object)
], CommentLikeSchema.prototype, "owner", void 0);
CommentLikeSchema = __decorate([
    modelOptions({ schemaOptions: { timestamps: true } })
], CommentLikeSchema);
export const CommentLike = getModelForClass(CommentLikeSchema);
