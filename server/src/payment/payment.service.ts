import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
	private stripe: Stripe;
	private YOUR_DOMAIN = 'http://localhost:4200/';

	constructor() {
		this.stripe = new Stripe(process.env.STRIP_SECRET_KEY, {
			apiVersion: '2020-08-27'
		});
	}

	async createCheckoutSession(price: number, rideData: any) {
		const amountToCharge = price * 100;

		try {
			const session = await this.stripe.checkout.sessions.create({
				line_items: [
					{
						price_data: {
							unit_amount: amountToCharge,
							currency: 'usd',
							product_data: {
								name:
									'Ticket price for ' +
									rideData.searchSeatQuantity +
									' passenger',
								description:
									'Ride start location is ' +
									rideData.startPlaceName +
									' and end location is ' +
									rideData.endPlaceName +
									' on ' +
									rideData.date +
									' at ' +
									rideData.time,
								images: [
									'https://blog-cdn.el.olx.com.pk/wp-content/uploads/2023/01/03172036/Car-Pool.jpg'
								]
							}
						},
						quantity: 1
					}
				],
				mode: 'payment',
				success_url: `${this.YOUR_DOMAIN}thankyou`,
				cancel_url: `${this.YOUR_DOMAIN}`
			});

			return {
				status: 'success',
				data: session.url
			};
		} catch (error) {
			console.log(error);
			throw new Error(error.message);
		}
	}
}
