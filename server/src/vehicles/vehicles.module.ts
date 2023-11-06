import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './vehicles.schema';
import { VehicleService } from './vehicles.service';
import { VehicleController } from './vehicles.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }])
	],
	providers: [VehicleService],
	exports: [VehicleService],
	controllers: [VehicleController]
})
export class VehiclesModule {}
