import mongoose, { Document } from 'mongoose';
export declare class Ride extends Document {
    geojson: {
        type: string;
        properties: object;
        geometry: {
            type: string;
            coordinates: number[][][];
        };
    };
    fare: number;
    duration: number;
    startTime: Date;
    endTime: Date;
    distance: number;
    bookedBy: mongoose.Types.ObjectId;
}
export declare const RideSchema: mongoose.Schema<Ride, mongoose.Model<Ride, any, any, any, mongoose.Document<unknown, any, Ride> & Ride & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Ride, mongoose.Document<unknown, {}, mongoose.FlatRecord<Ride>> & mongoose.FlatRecord<Ride> & {
    _id: mongoose.Types.ObjectId;
}>;
