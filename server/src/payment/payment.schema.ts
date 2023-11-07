import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail } from 'class-validator';

@Schema()
export class Payment extends Document {
	@IsEmail()
	@Prop({
		type: String,
		required: true,
		trim: true,
		lowercase: true
	})
	email: string;

	@Prop({
		type: Number,
		required: true
	})
	fare: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
