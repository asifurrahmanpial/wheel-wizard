import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {
	@Prop({ type: [Number], required: true })
	coordinates: number[];

	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: String, required: true })
	vehicleType: string;

	@Prop({ type: String, required: true })
	serviceZone: string;

	@Prop({ type: Number, required: true })
	price: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
