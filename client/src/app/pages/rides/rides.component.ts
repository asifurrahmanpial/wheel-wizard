import { Component, OnDestroy, OnInit } from '@angular/core';
import { format } from 'date-fns';
import * as mapboxgl from 'mapbox-gl';
import { AuthService } from 'src/app/services/auth.service';
import { MAPBOX_ACCESS_TOKEN, MAP_STYLE_URL } from '../../../config';

@Component({
	selector: 'app-rides',
	templateUrl: './rides.component.html',
	styleUrls: ['./rides.component.scss']
})
export class RidesComponent implements OnInit, OnDestroy {
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
		// this.initializeMap();
	}

	// initializeMap() {
	// 	(mapboxgl as any).accessToken = MAPBOX_ACCESS_TOKEN;

	// 	this.map = new mapboxgl.Map({
	// 		container: 'map',
	// 		style: MAP_STYLE_URL,
	// 		center: [90.41591465744375, 23.799395564120303],
	// 		zoom: 14
	// 		// interactive: false
	// 	});

	// 	this.map.on('load', () => {
	// 		this.fetchRideHistory().then(() => {
	// 			this.rides.forEach((ride: any, index: number) => {
	// 				const geojson = ride.geojson;
	// 				const sourceId = `line-${index}`;

	// 				// Add the GeoJSON data as a new source
	// 				this.map.addSource(sourceId, {
	// 					type: 'geojson',
	// 					data: geojson
	// 				});

	// 				// Add a new layer using the GeoJSON data
	// 				this.map.addLayer({
	// 					id: sourceId,
	// 					type: 'line',
	// 					source: sourceId,
	// 					layout: {
	// 						'line-join': 'round',
	// 						'line-cap': 'round'
	// 					},
	// 					paint: {
	// 						'line-color': '#888',
	// 						'line-width': 8
	// 					}
	// 				});
	// 			});
	// 		});
	// 	});
	// }

	async fetchRideHistory() {
		const observable = await this.authService.getRideHistory();
		return new Promise((resolve, reject) => {
			observable.subscribe(
				(data: any) => {
					this.rides = data.map((ride: any) => {
						ride.duration = this.calculateDuration(
							ride.startTime,
							ride.endTime
						);
						return ride;
					});
					resolve(true);
				},
				(error: any) => {
					reject(error);
				}
			);
		});
	}

	formatDateTime(dateTime: string): string {
		const date = new Date(dateTime);
		if (isNaN(date.getTime())) {
			return 'Invalid date';
		} else {
			const formattedDate = format(date, 'dd/MM/yyyy hh:mm a');
			return formattedDate;
		}
	}

	calculateDuration(startTime: string, endTime: string): string {
		const start = new Date(startTime).getTime();
		const end = new Date(endTime).getTime();
		const diff = end - start;

		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff / (1000 * 60)) % 60);
		const seconds = Math.floor((diff / 1000) % 60);

		return `${hours} hr ${minutes} min ${seconds} sec`;
	}

	ngOnDestroy() {
		// Remove the map when the component is destroyed
		if (this.map) {
			this.map.remove();
		}
	}
}
