import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Ride } from './ride.schema';
import { RideService } from './ride.service';
import { GetUser } from '../user/user.decorator'; // Import the custom decorator

@Controller('rides')
export class RideController {
	constructor(private readonly rideService: RideService) {}

	@UseGuards(JwtGuard)
	@Post()
	async createRide(@Body() rideData: Ride, @GetUser() user): Promise<Ride> {
		// Set the user who booked the ride
		rideData.bookedBy = user.id;
		return this.rideService.createRide(rideData);
	}

	@UseGuards(JwtGuard)
	@Get('history')
	async getUserRideHistory(@GetUser() user): Promise<Ride[]> {
		return this.rideService.findRidesByUser(user.id);
	}
}
