import { Injectable } from '@angular/core';
import { Stripe } from '@capacitor-community/stripe';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class StripeService {
	constructor(private http: HttpClient) {
		Stripe.initialize({
			publishableKey: environment.stripe.publishableKey
		});
	}
	async createPaymentIntent(email: string, fare: number): Promise<string> {
		const data = {
			email,
			fare
		};
		const response = await this.http
			.post<any>(environment.api + 'payment', data)
			.pipe(first())
			.toPromise();
		return response.client_secret;
	}
	async openPaymentSheet(clientSecret: string) {
		try {
			await Stripe.createPaymentSheet({
				paymentIntentClientSecret: clientSecret,
				merchantDisplayName: 'Technyks'
			});
			const result = await Stripe.presentPaymentSheet();
			return result;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}
}
