import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
	@Prop({ required: true })
	totalTrips: number;

	@Prop({ required: true })
	totalFare: number;

	@Prop({ required: true })
	totalDuration: number;

	@Prop({ required: true })
	totalDistance: number;

	@Prop({ required: true })
	username: string;

	@Prop({ required: true })
	userEmail: string;

	@Prop({ required: true })
	userId: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
