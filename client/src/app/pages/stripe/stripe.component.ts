// import { environment } from '../../../environments/environment';
// import { Component } from '@angular/core';
// import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
// import { HttpClient } from '@angular/common/http';
// import { first, lastValueFrom } from 'rxjs';

// @Component({
// 	selector: 'app-stripe',
// 	templateUrl: './stripe.component.html',
// 	styleUrls: ['./stripe.component.scss']
// })
// export class StripeComponent {
// 	data: any = {
// 		email: 'test@test.com',
// 		fare: 5
// 	};

// 	constructor(private http: HttpClient) {
// 		Stripe.initialize({
// 			publishableKey: environment.stripe.publishableKey
// 		});
// 	}

// 	httpPost(body: any) {
// 		return this.http.post<any>(environment.api + 'payment', body).pipe(first());
// 	}

// 	async paymentSheet() {
// 		try {
// 			Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
// 				console.log('PaymentSheetEventsEnum.Completed');
// 			});

// 			const data$ = this.httpPost(this.data);

// 			const { client_secret } = await lastValueFrom(data$);

// 			console.log('client_secret: ', client_secret);

// 			await Stripe.createPaymentSheet({
// 				paymentIntentClientSecret: client_secret,
// 				merchantDisplayName: 'Technyks'
// 			});

// 			console.log('createPaymentSheet');
// 			const result = await Stripe.presentPaymentSheet();
// 			console.log('result: ', result);
// 			if (result && result.paymentResult === PaymentSheetEventsEnum.Completed) {
// 				this.splitAndJoin(client_secret);
// 			}
// 		} catch (e) {
// 			console.log(e);
// 		}
// 	}

// 	splitAndJoin(paymentIntent: any) {
// 		const result = paymentIntent.split('_').slice(0, 2).join('_');
// 		console.log(result);
// 		return result;
// 	}
// }

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
	ApplePayEventsEnum,
	GooglePayEventsEnum,
	PaymentFlowEventsEnum,
	PaymentSheetEventsEnum,
	Stripe
} from '@capacitor-community/stripe';
import { first, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-stripe',
	templateUrl: './stripe.component.html',
	styleUrls: ['./stripe.component.scss']
})
export class StripeComponent {
	data: any = {
		name: 'Asif',
		email: 'one@one.com',
		amount: 100,
		currency: 'usd'
	};

	constructor(private http: HttpClient) {
		Stripe.initialize({
			publishableKey: environment.stripe.publishableKey
		});
	}

	httpPost(body: any) {
		return this.http
			.post<any>(environment.api + 'payment-sheet', body)
			.pipe(first());
	}

	async paymentSheet() {
		try {
			// be able to get event of PaymentSheet
			Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
				console.log('PaymentSheetEventsEnum.Completed');
			});

			// Connect to your backend endpoint, and get every key.
			const data$ = this.httpPost(this.data);

			const { paymentIntent, ephemeralKey, customer } =
				await lastValueFrom(data$);

			console.log('paymentIntent: ', paymentIntent);

			// prepare PaymentSheet with CreatePaymentSheetOption.
			await Stripe.createPaymentSheet({
				paymentIntentClientSecret: paymentIntent,
				customerId: customer,
				customerEphemeralKeySecret: ephemeralKey,
				merchantDisplayName: 'Technyks'
			});

			console.log('createPaymentSheet');
			// present PaymentSheet and get result.
			const result = await Stripe.presentPaymentSheet();
			console.log('result: ', result);
			if (result && result.paymentResult === PaymentSheetEventsEnum.Completed) {
				// Happy path
				this.splitAndJoin(paymentIntent);
			}
		} catch (e) {
			console.log(e);
		}
	}

	async paymentFlow() {
		// be able to get event of PaymentFlow
		Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
			console.log('PaymentFlowEventsEnum.Completed');
		});

		const data$ = this.httpPost(this.data);

		const { paymentIntent, ephemeralKey, customer } =
			await lastValueFrom(data$);

		// Prepare PaymentFlow with CreatePaymentFlowOption.
		await Stripe.createPaymentFlow({
			paymentIntentClientSecret: paymentIntent,
			customerEphemeralKeySecret: ephemeralKey,
			customerId: customer,
			merchantDisplayName: 'Technyks'
		});

		// Present PaymentFlow. **Not completed yet.**
		const presentResult = await Stripe.presentPaymentFlow();
		console.log('presentResult: ', presentResult); // { cardNumber: "●●●● ●●●● ●●●● ****" }

		// Confirm PaymentFlow. Completed.
		const confirmResult = await Stripe.confirmPaymentFlow();
		console.log('confirmResult: ', confirmResult);
		if (confirmResult.paymentResult === PaymentFlowEventsEnum.Completed) {
			// Happy path
			this.splitAndJoin(paymentIntent);
		}
	}

	async googlePay() {
		// Check to be able to use Google Pay on device
		const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
		if (isAvailable === undefined) {
			// disable to use Google Pay
			return;
		}

		Stripe.addListener(GooglePayEventsEnum.Completed, () => {
			console.log('GooglePayEventsEnum.Completed');
		});

		const data$ = this.httpPost(this.data);

		const { paymentIntent } = await lastValueFrom(data$);

		// Prepare Google Pay
		await Stripe.createGooglePay({
			paymentIntentClientSecret: paymentIntent,

			// Web only. Google Pay on Android App doesn't need
			paymentSummaryItems: [
				{
					label: 'Wheez',
					amount: 100
				}
			],
			merchantIdentifier: 'merchant.com.getcapacitor.stripe',
			countryCode: 'US',
			currency: 'USD'
		});

		// Present Google Pay
		const result = await Stripe.presentGooglePay();
		if (result.paymentResult === GooglePayEventsEnum.Completed) {
			// Happy path
			this.splitAndJoin(paymentIntent);
		}
	}

	splitAndJoin(paymentIntent: any) {
		const result = paymentIntent.split('_').slice(0, 2).join('_');
		console.log(result);
		return result;
	}
}
