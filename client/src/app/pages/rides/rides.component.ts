import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { AuthService } from 'src/app/services/auth.service';
import { MAPBOX_ACCESS_TOKEN, MAP_STYLE_URL } from '../../../config';
import { format } from 'date-fns';

@Component({
	selector: 'app-rides',
	templateUrl: './rides.component.html',
	styleUrls: ['./rides.component.scss']
})
export class RidesComponent implements OnInit {
	totalCost: number;
	rideStartTime: string;
	rideEndTime: string;
	map!: mapboxgl.Map;
	rides: any[] = [];

	constructor(private authService: AuthService) {
		this.totalCost = 0;
		this.rideStartTime = '';
		this.rideEndTime = '';
	}

	ngOnInit() {
		this.fetchRideHistory();
		this.initializeMap();
	}

	initializeMap() {
		(mapboxgl as any).accessToken = MAPBOX_ACCESS_TOKEN;

		this.map = new mapboxgl.Map({
			container: 'map',
			style: MAP_STYLE_URL,
			center: [90.41591465744375, 23.799395564120303],
			zoom: 14
		});
	}
	fetchRideHistory() {
		this.authService.getRideHistory().subscribe((data: any) => {
			this.rides = data;
		});
	}

	formatDateTime(dateTime: string): string {
		const formattedDate = format(new Date(dateTime), 'dd/MM/yyyy hh:mm a');
		return formattedDate;
	}
}
