import {
  getModelForClass,
  modelOptions,
  prop,
  type Ref,
} from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class CarLikeSchema {
  @prop({ ref: () => 'UserSchema', required: true })
  public owner!: Ref<any>;

  @prop({ ref: () => 'CarSchema', required: true })
  public car!: Ref<any>;
}

const CarLike = getModelForClass(CarLikeSchema);
export { CarLike };