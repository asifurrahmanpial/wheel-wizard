import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDetails } from './user-details.interface';
import { UserDocument } from './user.schema';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<UserDocument>,
		private readonly profileService: ProfileService
	) {}

	_getUserDetails(user: UserDocument): UserDetails {
		return {
			_id: user.id,
			name: user.name,
			email: user.email
		};
	}

	async findByEmail(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ email }).exec();
	}

	async findById(id: string): Promise<UserDetails | null> {
		const user = await this.userModel.findById(id).exec();
		if (!user) {
			return null;
		}
		return this._getUserDetails(user);
	}

	async create(
		name: string,
		email: string,
		hashedPassword: string
	): Promise<UserDocument> {
		const newUser = new this.userModel({
			name,
			email,
			password: hashedPassword
		});
		await this.profileService.createProfile(newUser._id, name, email);
		return newUser.save();
	}
}
