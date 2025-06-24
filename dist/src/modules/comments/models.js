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
let CommentSchema = class CommentSchema {
    task;
    owner;
    parent;
    replies;
    context;
    replyCount;
    likeCount;
};
__decorate([
    prop({ ref: () => 'TaskSchema', required: true }),
    __metadata("design:type", Object)
], CommentSchema.prototype, "task", void 0);
__decorate([
    prop({ ref: () => 'UserSchema', required: true }),
    __metadata("design:type", Object)
], CommentSchema.prototype, "owner", void 0);
__decorate([
    prop({ ref: () => CommentSchema }),
    __metadata("design:type", Object)
], CommentSchema.prototype, "parent", void 0);
__decorate([
    prop({ ref: () => CommentSchema }),
    __metadata("design:type", Array)
], CommentSchema.prototype, "replies", void 0);
__decorate([
    prop({ type: () => String, required: true, minlength: 1 }),
    __metadata("design:type", String)
], CommentSchema.prototype, "context", void 0);
__decorate([
    prop({ type: () => Number, default: 0 }),
    __metadata("design:type", Number)
], CommentSchema.prototype, "replyCount", void 0);
__decorate([
    prop({ type: () => Number, default: 0 }),
    __metadata("design:type", Number)
], CommentSchema.prototype, "likeCount", void 0);
CommentSchema = __decorate([
    modelOptions({ schemaOptions: { timestamps: true } })
], CommentSchema);
export { CommentSchema };
const Comment = getModelForClass(CommentSchema);
export { Comment };
