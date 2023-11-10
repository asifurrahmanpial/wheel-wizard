import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { format } from 'date-fns';
import { StripeService } from 'src/app/services/stripe.service';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { UserService } from 'src/app/services/user.service'; // Import UserService
import { FareService } from 'src/app/services/fare.service';
import { CameraService } from 'src/app/services/camera.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-ride-summary',
	templateUrl: './ride-summary.component.html',
	styleUrls: ['./ride-summary.component.scss']
})
export class RideSummaryComponent implements OnInit {
	duration!: string;
	startTime!: string;
	endTime!: string;
	distance!: number;
	email!: any;
	fare!: number;
	isImageTaken: boolean = false;
	image: SafeUrl | null = null;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private stripeService: StripeService,
		private userService: UserService,
		private fareService: FareService,
		private cameraService: CameraService
	) {
		const navigation = this.router.getCurrentNavigation();
		if (navigation && navigation.extras.state) {
			const state = navigation.extras.state as { data: any };
			console.log('Ride details:', state.data);

			this.fareService.setFare(Math.round(state.data.fare)); // Store the rounded fare in the service
			this.fare = this.fareService.getFare(); // Retrieve the fare immediately after setting it
			const durationInSeconds = Math.floor(state.data.duration / 1000);
			const hours = Math.floor(durationInSeconds / 3600);
			const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
			const seconds = durationInSeconds - hours * 3600 - minutes * 60;

			this.duration = `${hours} hr ${minutes} min ${seconds} sec`;
			this.startTime = format(new Date(state.data.startTime), 'PPpp');
			this.endTime = format(new Date(state.data.endTime), 'PPpp');
			this.distance = state.data.distance;
		}
	}

	ngOnInit() {
		this.email = this.userService.getEmail();
		this.fare = this.fareService.getFare();

		console.log('email', this.email);
		console.log('fare', this.fare);
	}

	async initiateStripePayment(email: string, fare: number) {
		console.log('initiateStripePayment method called'); // Log when the method is called
		if (email && fare) {
			console.log('Email and fare are present'); // Log when email and fare are present
			try {
				const clientSecret = await this.stripeService.createPaymentIntent(
					email,
					fare
				);
				console.log('Client secret:', clientSecret); // Log the client secret
				const result = await this.stripeService.openPaymentSheet(clientSecret);
				console.log('Payment sheet result:', result); // Log the result of presenting the payment sheet

				if (
					result &&
					result.paymentResult === PaymentSheetEventsEnum.Completed
				) {
					// Payment completed, handle the success case
					console.log('Payment completed');
					this.router.navigate(['/map']); // Redirect to /map
				}
			} catch (error) {
				// Handle any errors that occur during the payment process
				console.error('Payment error:', error);
			}
		} else {
			// Handle the case where email or fare is missing
			console.error('Email and fare are required for payment');
		}
	}

	async takePicture() {
		console.log('Email before taking picture:', this.email);
		this.image = await this.cameraService.takePicture();
		console.log('Email after taking picture:', this.email);
		if (this.image) {
			this.isImageTaken = true;
		}
	}
}
