import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileDocument } from './profile.schema';
import { UpdateProfileDto } from './UpdateProfileDto';

@Injectable()
export class ProfileService {
	constructor(
		@InjectModel('Profile')
		private readonly profileModel: Model<ProfileDocument>
	) {}

	async createProfile(
		userId: string,
		username: string,
		userEmail: string
	): Promise<ProfileDocument> {
		const newProfile = new this.profileModel({
			totalTrips: 0,
			totalFare: 0,
			totalDuration: 0,
			totalDistance: 0,
			username,
			userEmail,
			userId
		});

		// Save the new profile to the database
		return newProfile.save();
	}

	async updateProfile(
		id: string,
		updateProfileDto: UpdateProfileDto
	): Promise<ProfileDocument> {
		return this.profileModel
			.findByIdAndUpdate(id, updateProfileDto, { new: true })
			.exec();
	}

	async findByUserId(userId: string): Promise<ProfileDocument | null> {
		return this.profileModel.findOne({ userId }).exec();
	}

	async getProfile(id: string): Promise<ProfileDocument> {
		return this.profileModel.findById(id).exec();
	}

	async getProfileByUserId(userId: string): Promise<ProfileDocument> {
		return this.profileModel.findOne({ userId: userId }).exec();
	}
}
