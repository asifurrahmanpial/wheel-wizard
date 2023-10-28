import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Ride extends Document {
	@Prop({
		type: {
			type: String,
			required: true,
			default: 'Feature'
		},
		properties: {
			type: Object,
			default: {}
		},
		geometry: {
			type: {
				type: String,
				required: true,
				default: 'LineString'
			},
			coordinates: {
				type: [[[Number]]],
				required: true,
				default: []
			}
		}
	})
	geojson: {
		type: string;
		properties: object;
		geometry: {
			type: string;
			coordinates: number[][][];
		};
	};

	@Prop({
		type: Number,
		required: true
	})
	fare: number;

	@Prop({
		type: Date,
		required: true
	})
	startTime: Date;

	@Prop({
		type: Date,
		required: true
	})
	endTime: Date;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	bookedBy: mongoose.Types.ObjectId;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
