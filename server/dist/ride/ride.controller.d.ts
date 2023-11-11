import { Ride } from './ride.schema';
import { RideService } from './ride.service';
export declare class RideController {
    private readonly rideService;
    constructor(rideService: RideService);
    createRide(rideData: Ride, user: any): Promise<Ride>;
    getUserRideHistory(user: any): Promise<Ride[]>;
}
