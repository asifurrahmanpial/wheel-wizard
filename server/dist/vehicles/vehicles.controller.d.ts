import { Vehicle } from './vehicles.schema';
import { VehicleService } from './vehicles.service';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    getAllVehicles(): Promise<Vehicle[]>;
    createVehicle(vehicleData: Vehicle): Promise<Vehicle>;
    updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle>;
}
