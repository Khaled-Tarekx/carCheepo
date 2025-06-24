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
import { Types } from 'mongoose';
import { Status } from './types.js';
import { nanoid } from 'nanoid';
let TaskSchema = class TaskSchema {
    title;
    description;
    priority;
    publicId;
    commentCount;
    creator;
    assignees;
    workspace;
    tags;
    attachment;
    deadline;
    subtasks;
    parentTask;
    status;
    customFields;
};
__decorate([
    prop({ type: () => String, required: true }),
    __metadata("design:type", String)
], TaskSchema.prototype, "title", void 0);
__decorate([
    prop({ type: () => String, required: true }),
    __metadata("design:type", String)
], TaskSchema.prototype, "description", void 0);
__decorate([
    prop({ type: () => Number, required: true, max: 10 }),
    __metadata("design:type", Number)
], TaskSchema.prototype, "priority", void 0);
__decorate([
    prop({ type: () => String, unique: true, default: () => nanoid(10) }),
    __metadata("design:type", String)
], TaskSchema.prototype, "publicId", void 0);
__decorate([
    prop({ type: () => Number, default: 0 }),
    __metadata("design:type", Number)
], TaskSchema.prototype, "commentCount", void 0);
__decorate([
    prop({ ref: () => 'MemberSchema', required: true }),
    __metadata("design:type", Object)
], TaskSchema.prototype, "creator", void 0);
__decorate([
    prop({ ref: () => 'MemberSchema', required: true }),
    __metadata("design:type", Types.Array)
], TaskSchema.prototype, "assignees", void 0);
__decorate([
    prop({ ref: () => 'WorkSpaceSchema', required: true }),
    __metadata("design:type", Object)
], TaskSchema.prototype, "workspace", void 0);
__decorate([
    prop({ type: () => [String], required: true }),
    __metadata("design:type", Types.Array)
], TaskSchema.prototype, "tags", void 0);
__decorate([
    prop({ type: () => String }),
    __metadata("design:type", String)
], TaskSchema.prototype, "attachment", void 0);
__decorate([
    prop({ type: () => Date, required: true }),
    __metadata("design:type", Date)
], TaskSchema.prototype, "deadline", void 0);
__decorate([
    prop({ ref: () => TaskSchema }),
    __metadata("design:type", Types.Array)
], TaskSchema.prototype, "subtasks", void 0);
__decorate([
    prop({ ref: () => TaskSchema }),
    __metadata("design:type", Object)
], TaskSchema.prototype, "parentTask", void 0);
__decorate([
    prop({ type: () => String, enum: Status, default: Status.Unassigned }),
    __metadata("design:type", String)
], TaskSchema.prototype, "status", void 0);
__decorate([
    prop({ type: () => Map }),
    __metadata("design:type", Map)
], TaskSchema.prototype, "customFields", void 0);
TaskSchema = __decorate([
    modelOptions({ schemaOptions: { timestamps: true } })
], TaskSchema);
export { TaskSchema };
const TaskModel = getModelForClass(TaskSchema);
export default TaskModel;
