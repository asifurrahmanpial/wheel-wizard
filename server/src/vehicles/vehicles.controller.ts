import { Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { Vehicle } from './vehicles.schema';
import { VehicleService } from './vehicles.service';

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

	// vehicles.controller.ts
	@Put(':id')
	async updateVehicle(
		@Param('id') id: string,
		@Body() vehicleData: Partial<Vehicle>
	): Promise<Vehicle> {
		return this.vehicleService.updateVehicle(id, vehicleData);
	}
}
