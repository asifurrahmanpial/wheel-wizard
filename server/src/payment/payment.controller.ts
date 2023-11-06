import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post('/payment-sheet')
	async createPaymentSheet(@Body() body: any) {
		try {
			return await this.paymentService.createPaymentSheet(body);
		} catch (error) {
			console.error(error); // Log the error
			throw new Error(error.message);
		}
	}
}
