import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Roles } from '../auth/types';

@modelOptions({ schemaOptions: { timestamps: true, id: true } })
export class UserSchema {
	@prop({ type: () => String, required: true })
	public username!: string;

	@prop({ type: () => Boolean })
	public isLoggedIn?: boolean;

	@prop({ type: () => String, enum: Roles, default: Roles.user })
	public roles?: Roles;

	@prop({ type: () => String, required: true, unique: true, index: true })
	public email!: string;
	@prop({
		type: () => String,
		required: true,
		unique: true,
		maxlength: 13,
		minlength: 9,
	})
	public phone!: string;
	@prop({ type: () => String, required: true })
	public city!: string;

	@prop({ type: () => String, required: true })
	public country!: string;
	@prop({
		type: () => String,
		minlength: [6, 'Must be at least 6 characters'],
		maxlength: [100, 'Must be at most 100 characters'],
	})
	public password?: string;

	@prop({
		type: () => String,
		minlength: [6, 'Must be at least 6 characters'],
		maxlength: [6, 'Must be at most 6 characters'],
	})
	public resetPasswordCode?: string;

	@prop({
		type: () => Date,
	})
	public resetPasswordExpire?: Date;
}

const UserModel = getModelForClass(UserSchema);
export default UserModel;
