import { Controller, Get, Post, Body } from '@nestjs/common';
import { VehicleService } from './vehicles.service';
import { Vehicle } from './vehicles.schema';

@Controller('vehicles')
export class VehicleController {
	constructor(private readonly vehicleService: VehicleService) {}

	@Get()
	async getAllVehicles(): Promise<Vehicle[]> {
		return this.vehicleService.findAllVehicles();
	}

	@Post()
	async createVehicle(@Body() vehicleData: Vehicle): Promise<Vehicle> {
		return this.vehicleService.createVehicle(vehicleData);
	}
}
