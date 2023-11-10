import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-book-ride',
	templateUrl: './book-ride.component.html',
	styleUrls: ['./book-ride.component.scss']
})
export class BookRideComponent implements OnInit {
	vehicleData: any;
	Checklist = this._formBuilder.group({
		pointOne: false,
		pointTwo: false,
		pointThree: false
	});

	hasBookedRide: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private _formBuilder: FormBuilder,
		private router: Router
	) {}

	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			const state = window.history.state;
			if (state && state.vehicleData) {
				this.vehicleData = state.vehicleData;
			}
		});
	}

	isChecklistComplete() {
		return (
			this.Checklist.controls.pointOne.value &&
			this.Checklist.controls.pointTwo.value &&
			this.Checklist.controls.pointThree.value
		);
	}

	continueRide() {
		this.hasBookedRide = true;
		this.router.navigate(['/map'], {
			state: {
				hasBookedRide: this.hasBookedRide,
				vehicleData: this.vehicleData
			}
		});
	}

	getBaseFare() {
		if (this.vehicleData && this.vehicleData.vehicleType) {
			const vehicleType = this.vehicleData.vehicleType.toLowerCase();

			switch (vehicleType) {
				case 'scooter':
					return 50;
				case 'cycle':
					return 20;
				default:
					throw new Error('Invalid vehicle type');
			}
		}
		return 0;
	}
}
