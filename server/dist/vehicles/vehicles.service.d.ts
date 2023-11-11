import { Model } from 'mongoose';
import { Vehicle } from './vehicles.schema';
export declare class VehicleService {
    private vehicleModel;
    constructor(vehicleModel: Model<Vehicle>);
    findAllVehicles(): Promise<Vehicle[]>;
    createVehicle(vehicleData: Vehicle): Promise<Vehicle>;
    updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle>;
}
