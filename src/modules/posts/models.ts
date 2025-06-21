import {
	getModelForClass,
	prop,
	type Ref,
	modelOptions,
} from '@typegoose/typegoose';
import { UserSchema } from '../users/models';
import { CarSchema } from '../cars/models';

@modelOptions({ schemaOptions: { timestamps: true } })
class PostSchema {
	@prop({ ref: () => UserSchema, required: true })
	public publisher!: Ref<UserSchema>;

	@prop({ type: () => String, required: true })
	public title!: string;

	@prop({ type: () => String, equired: true })
	public context!: string;

	@prop({ _id: false })
	public car!: CarSchema;

	@prop({ default: false })
	public isPublished!: boolean;

	@prop({ type: () => Number, default: 0 })
	public reviewCount!: number;
}

const Post = getModelForClass(PostSchema);

export { Post, PostSchema };
