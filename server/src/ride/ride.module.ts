import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from './ride.schema';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }])
	],
	providers: [RideService],
	exports: [RideService],
	controllers: [RideController]
})
export class RideModule {}
