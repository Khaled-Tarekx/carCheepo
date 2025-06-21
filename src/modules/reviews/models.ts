import {
	getModelForClass,
	prop,
	type Ref,
	modelOptions,
} from '@typegoose/typegoose';
import { UserSchema } from '../users/models';

@modelOptions({ schemaOptions: { timestamps: true } })
export class ReviewSchema {
	@prop({ ref: () => 'UserSchema', required: true })
	public owner!: Ref<UserSchema>;

	@prop({ ref: () => 'PostSchema', required: true })
	public post!: Ref<'PostSchema'>;

	@prop({ type: () => String, required: true, minlength: 1 })
	public context!: string;

	@prop({ type: () => Number, default: 0 })
	public likeCount!: number;
	@prop({ type: () => Number, default: 0 })
	public viewCount!: number;
}

const Review = getModelForClass(ReviewSchema);
export { Review };
