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

	async createPaymentIntent(email: string, amount: number) {
		// Create a new customer
		const customer = await this.stripe.customers.create({ email });

		// Create a new payment intent
		const paymentIntent = await this.stripe.paymentIntents.create({
			amount, // amount should be in cents
			currency: 'bdt',
			customer: customer.id,
			payment_method_types: ['card']
		});

		return paymentIntent;
	}
}
