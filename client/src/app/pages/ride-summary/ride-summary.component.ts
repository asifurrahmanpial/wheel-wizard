import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';

@Component({
	selector: 'app-ride-summary',
	templateUrl: './ride-summary.component.html',
	styleUrls: ['./ride-summary.component.scss']
})
export class RideSummaryComponent {
	fare!: number;
	duration!: string;
	startTime!: string;
	endTime!: string;
	distance!: number;

	constructor(private router: Router) {
		const navigation = this.router.getCurrentNavigation();
		if (navigation && navigation.extras.state) {
			const state = navigation.extras.state as { data: any };
			console.log('Ride details:', state.data);

			this.fare = state.data.fare;
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
}
