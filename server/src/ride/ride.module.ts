import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from './ride.schema';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { ProfileModule } from '../profile/profile.module'; // import here

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
		ProfileModule // add here
	],
	providers: [RideService],
	exports: [RideService],
	controllers: [RideController]
})
export class RideModule {}
