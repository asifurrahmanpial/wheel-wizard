import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post()
	async createPaymentIntent(
		@Body('email') email: string,
		@Body('fare') fare: number
	) {
		try {
			// Convert fare to cents as Stripe works with the smallest currency unit
			const amount = fare * 100;
			return await this.paymentService.createPaymentIntent(email, amount);
		} catch (error) {
			console.error(error);
			throw new Error(error.message);
		}
	}
}
