import {
	getModelForClass,
	modelOptions,
	prop,
	type Ref,
} from '@typegoose/typegoose';
import { UserSchema } from '../users/models';
import { ReviewSchema } from '../reviews/models';

@modelOptions({ schemaOptions: { timestamps: true } })
class ReviewViewSchema {
	@prop({ ref: () => 'ReviewSchema', required: true })
	public review!: Ref<ReviewSchema>;

	@prop({ ref: () => 'UserSchema', required: true })
	public owner!: Ref<UserSchema>;
}

export const ReviewView = getModelForClass(ReviewViewSchema);
