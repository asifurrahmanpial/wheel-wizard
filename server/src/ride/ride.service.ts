import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './ride.schema';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class RideService {
	constructor(
		@InjectModel('Ride') private readonly rideModel: Model<Ride>,
		private readonly profileService: ProfileService
	) {}

	sanitizeNumber(input: string | number): number {
		if (typeof input === 'number') {
			return input;
		}
		return Number(input.replace('.', '').replace(',', '.'));
	}

	async createRide(rideData: Ride): Promise<Ride> {
		const createdRide = new this.rideModel(rideData);
		if (rideData.bookedBy) {
			// Get the profile by the user's ID
			const profile = await this.profileService.getProfileByUserId(
				rideData.bookedBy.toString()
			);
			if (!profile) {
				throw new Error('No profile found for the provided user ID');
			}
			// Set bookedBy to the profile's ID
			createdRide.bookedBy = profile._id;
			const updatedProfile = {
				totalTrips: profile.totalTrips + 1,
				totalFare: profile.totalFare + rideData.fare,
				totalDuration: profile.totalDuration + rideData.duration,
				totalDistance:
					profile.totalDistance + this.sanitizeNumber(rideData.distance)
			};
			await this.profileService.updateProfile(
				profile._id.toString(),
				updatedProfile
			);
		} else {
			throw new Error('bookedBy field is undefined');
		}
		return createdRide.save();
	}

	async findAllRides(): Promise<Ride[]> {
		return this.rideModel.find().exec();
	}

	async findRidesByUser(userId: string): Promise<Ride[]> {
		// Get the profile by the user's ID
		const profile = await this.profileService.getProfileByUserId(userId);
		if (!profile) {
			throw new Error('No profile found for the provided user ID');
		}
		// Find rides by the profile's ID
		return this.rideModel.find({ bookedBy: profile._id.toString() }).exec();
	}
}
