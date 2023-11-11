import { Model } from 'mongoose';
import { Ride } from './ride.schema';
import { ProfileService } from '../profile/profile.service';
export declare class RideService {
    private readonly rideModel;
    private readonly profileService;
    constructor(rideModel: Model<Ride>, profileService: ProfileService);
    sanitizeNumber(input: string | number): number;
    createRide(rideData: Ride): Promise<Ride>;
    findAllRides(): Promise<Ride[]>;
    findRidesByUser(userId: string): Promise<Ride[]>;
}
