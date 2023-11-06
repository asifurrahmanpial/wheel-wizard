import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post('/create-checkout-session')
	async createCheckoutSession(@Body() body: any) {
		const { price, rideData } = body;
		return this.paymentService.createCheckoutSession(price, rideData);
	}
}
