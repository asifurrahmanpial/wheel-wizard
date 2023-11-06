import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {
	@Prop({ type: String, required: true }) // Vehicle title
	title: string;

	@Prop({ type: Number, required: true }) // Vehicle price
	price: number;

	@Prop({ type: String, required: true }) // Vehicle type
	type: string;

	@Prop({ type: [Number], required: true }) // Coordinates as an array of numbers
	coordinates: number[];
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
