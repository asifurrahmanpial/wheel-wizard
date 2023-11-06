import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
	private stripe: Stripe;

	constructor() {
		this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2023-10-16'
		});
	}

	async createPaymentSheet(data: any) {
		try {
			const params = {
				email: data.email,
				name: data.name
			};
			const customer = await this.stripe.customers.create(params);

			const ephemeralKey = await this.stripe.ephemeralKeys.create(
				{ customer: customer.id },
				{ apiVersion: '2023-10-16' }
			);

			// const paymentIntent = await this.stripe.paymentIntents.create({
			// 	amount: parseInt(data.amount),
			// 	currency: data.currency,
			// 	customer: customer.id,
			// 	automatic_payment_methods: {
			// 		enabled: true
			// 	}
			// });

			const paymentIntent = await this.stripe.paymentIntents.create({
				amount: 1000, // amount in cents
				currency: 'usd',
				payment_method_types: ['card']
			});

			return {
				paymentIntent: paymentIntent.client_secret,
				ephemeralKey: ephemeralKey.secret,
				customer: customer.id
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
