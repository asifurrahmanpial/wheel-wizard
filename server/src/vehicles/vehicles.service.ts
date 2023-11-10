import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from './vehicles.schema';

@Injectable()
export class VehicleService {
	constructor(
		@InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>
	) {}

	async findAllVehicles(): Promise<Vehicle[]> {
		return this.vehicleModel.find().exec();
	}

	async createVehicle(vehicleData: Vehicle): Promise<Vehicle> {
		const newVehicle = new this.vehicleModel(vehicleData);
		return newVehicle.save();
	}

	async updateVehicle(
		id: string,
		vehicleData: Partial<Vehicle>
	): Promise<Vehicle> {
		return this.vehicleModel.findByIdAndUpdate(id, vehicleData, { new: true });
	}
}
