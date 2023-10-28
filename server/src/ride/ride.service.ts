import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './ride.schema';

@Injectable()
export class RideService {
	constructor(@InjectModel('Ride') private readonly rideModel: Model<Ride>) {}

	async createRide(rideData: Ride): Promise<Ride> {
		const createdRide = new this.rideModel(rideData);
		return createdRide.save();
	}

	async findAllRides(): Promise<Ride[]> {
		return this.rideModel.find().exec();
	}

	async findRidesByUser(userId: string): Promise<Ride[]> {
		return this.rideModel.find({ bookedBy: userId }).exec();
	}
}
