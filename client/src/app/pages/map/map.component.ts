// import { Component, OnInit } from '@angular/core';
// import { Geolocation, Position } from '@capacitor/geolocation';
// import { LocationService } from 'src/app/location.service';
// import * as mapboxgl from 'mapbox-gl';
// import { MAPBOX_ACCESS_TOKEN, MAP_STYLE_URL } from '../../../config';

// @Component({
// 	selector: 'app-map',
// 	templateUrl: './map.component.html',
// 	styleUrls: ['./map.component.scss']
// })
// export class MapComponent implements OnInit {
// 	private map!: mapboxgl.Map;
// 	private marker?: mapboxgl.Marker;
// 	private markerVisible = false;
// 	tracking = false;
// 	private watchId?: string | undefined;

// 	constructor(private locationService: LocationService) {}

// 	async ngOnInit(): Promise<void> {
// 		(mapboxgl as any).accessToken = MAPBOX_ACCESS_TOKEN;

// 		this.initializeMap();

// 		// Try to get the saved location from local storage
// 		const savedLocation = this.locationService.getLocation();

// 		if (savedLocation) {
// 			this.addMarkerAndFlyToLocation(
// 				savedLocation.latitude,
// 				savedLocation.longitude
// 			);
// 		}
// 	}

// 	async toggleMarker() {
// 		if (!this.tracking) {
// 			this.startTracking();
// 		} else {
// 			this.stopTracking();
// 		}
// 	}

// 	private initializeMap() {
// 		this.map = new mapboxgl.Map({
// 			container: 'map',
// 			style: MAP_STYLE_URL,
// 			center: [90.407293, 23.8103],
// 			zoom: 9
// 		});
// 	}

// 	private async getUserLocation(): Promise<Position | undefined> {
// 		try {
// 			const position = await Geolocation.getCurrentPosition({
// 				enableHighAccuracy: true
// 			});
// 			return position;
// 		} catch (error) {
// 			console.error('Error getting user location:', error);
// 			return undefined;
// 		}
// 	}

// 	private addMarkerAndFlyToLocation(latitude: number, longitude: number) {
// 		if (this.marker) {
// 			this.marker.remove();
// 		}

// 		this.marker = new mapboxgl.Marker()
// 			.setLngLat([longitude, latitude])
// 			.addTo(this.map);

// 		this.map.flyTo({
// 			center: [longitude, latitude],
// 			zoom: 16,
// 			speed: 1.5,
// 			curve: 1.4,
// 			essential: true
// 		});

// 		this.markerVisible = true;
// 	}

// 	private async watchUserLocation() {
// 		const options = {
// 			enableHighAccuracy: true,
// 			timeout: 2000,
// 			maximumAge: 0
// 		};

// 		try {
// 			const watchId = await Geolocation.watchPosition(options, (position) => {
// 				if (position && position.coords) {
// 					const { latitude, longitude } = position.coords;
// 					console.log(
// 						`User's current location: Latitude ${latitude}, Longitude ${longitude}`
// 					);
// 					// Save the location to local storage
// 					this.locationService.saveLocation({ latitude, longitude });
// 				}
// 			});

// 			this.watchId = watchId;
// 		} catch (error) {
// 			console.error('Error watching user location:', error);
// 		}
// 	}

// 	private async stopWatchingUserLocation() {
// 		if (this.watchId) {
// 			await Geolocation.clearWatch({ id: this.watchId });
// 			this.watchId = undefined;
// 		}
// 	}

// 	private async startTracking() {
// 		this.tracking = true;
// 		const position = await this.getUserLocation();

// 		if (position && position.coords) {
// 			const { latitude, longitude } = position.coords;
// 			console.log(
// 				`User's start location: Latitude ${latitude}, Longitude ${longitude}`
// 			);
// 			this.addMarkerAndFlyToLocation(latitude, longitude);
// 		}

// 		this.watchUserLocation();
// 	}

// 	private stopTracking() {
// 		this.tracking = false;
// 		if (this.markerVisible) {
// 			this.marker?.remove();
// 			this.markerVisible = false;
// 		}
// 		this.stopWatchingUserLocation();

// 		// Retrieve and display the stop location
// 		const stopLocation = this.locationService.getLocation();
// 		if (stopLocation) {
// 			const { latitude, longitude } = stopLocation;
// 			console.log(
// 				`User's stop location: Latitude ${latitude}, Longitude ${longitude}`
// 			);
// 		}
// 	}
// }

// import { Component, OnInit } from '@angular/core';
// import { Geolocation, Position } from '@capacitor/geolocation';
// import * as mapboxgl from 'mapbox-gl';
// import { MAPBOX_ACCESS_TOKEN, MAP_STYLE_URL } from '../../../config';

// @Component({
// 	selector: 'app-map',
// 	templateUrl: './map.component.html',
// 	styleUrls: ['./map.component.scss']
// })
// export class MapComponent implements OnInit {
// 	private map!: mapboxgl.Map;
// 	private marker?: mapboxgl.Marker;
// 	private markerVisible = false;
// 	tracking = false;
// 	private watchId?: string | undefined;

// 	// Variables to track ride information
// 	private rideStartTime?: number;
// 	private rideEndTime?: number;
// 	// private totalDistance = 0;
// 	public totalDistance = 0;

// 	constructor() {}

// 	async ngOnInit(): Promise<void> {
// 		(mapboxgl as any).accessToken = MAPBOX_ACCESS_TOKEN;

// 		this.initializeMap();
// 	}

// 	async toggleMarker() {
// 		if (!this.tracking) {
// 			this.startTracking();
// 		} else {
// 			this.stopTracking();
// 		}
// 	}

// 	private initializeMap() {
// 		this.map = new mapboxgl.Map({
// 			container: 'map',
// 			style: MAP_STYLE_URL,
// 			center: [90.407293, 23.8103],
// 			zoom: 9
// 		});
// 	}

// 	private async getUserLocation(): Promise<Position | undefined> {
// 		try {
// 			const position = await Geolocation.getCurrentPosition({
// 				enableHighAccuracy: true
// 			});
// 			return position;
// 		} catch (error) {
// 			console.error('Error getting user location:', error);
// 			return undefined;
// 		}
// 	}

// 	private addMarkerAndFlyToLocation(latitude: number, longitude: number) {
// 		if (this.marker) {
// 			this.marker.remove();
// 		}

// 		this.marker = new mapboxgl.Marker()
// 			.setLngLat([longitude, latitude])
// 			.addTo(this.map);

// 		this.map.flyTo({
// 			center: [longitude, latitude],
// 			zoom: 16,
// 			speed: 1.5,
// 			curve: 1.4,
// 			essential: true
// 		});

// 		this.markerVisible = true;
// 	}

// 	private async watchUserLocation() {
// 		const options = {
// 			enableHighAccuracy: true,
// 			timeout: 2000,
// 			maximumAge: 0
// 		};

// 		try {
// 			const watchId = await Geolocation.watchPosition(options, (position) => {
// 				if (position && position.coords) {
// 					const { latitude, longitude } = position.coords;
// 					console.log(
// 						`User's current location: Latitude ${latitude}, Longitude ${longitude}`
// 					);

// 					// Calculate and update distance if there is a previous location
// 					if (this.marker && this.markerVisible) {
// 						const prevLocation = this.marker.getLngLat();
// 						const distance = this.calculateDistance(
// 							prevLocation.lng,
// 							prevLocation.lat,
// 							longitude,
// 							latitude
// 						);
// 						this.totalDistance += distance;
// 					}

// 					// Save the location as the marker
// 					this.addMarkerAndFlyToLocation(latitude, longitude);
// 				}
// 			});

// 			this.watchId = watchId;
// 		} catch (error) {
// 			console.error('Error watching user location:', error);
// 		}
// 	}

// 	private async stopWatchingUserLocation() {
// 		if (this.watchId) {
// 			await Geolocation.clearWatch({ id: this.watchId });
// 			this.watchId = undefined;
// 		}
// 	}

// 	private async startTracking() {
// 		this.tracking = true;
// 		this.rideStartTime = Date.now();

// 		const position = await this.getUserLocation();

// 		if (position && position.coords) {
// 			const { latitude, longitude } = position.coords;
// 			console.log(
// 				`User's start location: Latitude ${latitude}, Longitude ${longitude}`
// 			);
// 			this.addMarkerAndFlyToLocation(latitude, longitude);
// 		}

// 		this.watchUserLocation();
// 	}

// 	private stopTracking() {
// 		this.tracking = false;
// 		this.rideEndTime = Date.now();

// 		if (this.markerVisible) {
// 			this.marker?.remove();
// 			this.markerVisible = false;
// 		}

// 		// Retrieve and display the stop location
// 		const stopLocation = this.marker?.getLngLat();
// 		if (stopLocation) {
// 			const { lat, lng } = stopLocation;
// 			console.log(`User's stop location: Latitude ${lat}, Longitude ${lng}`);

// 			// Calculate the total ride time
// 			if (this.rideStartTime && this.rideEndTime) {
// 				const rideTimeInSeconds =
// 					(this.rideEndTime - this.rideStartTime) / 1000;
// 				console.log(`Total ride time: ${rideTimeInSeconds} seconds`);
// 			}

// 			// Display the total distance
// 			console.log(`Total distance: ${this.totalDistance} meters`);
// 		}
// 	}

// 	private calculateDistance(
// 		lat1: number,
// 		lon1: number,
// 		lat2: number,
// 		lon2: number
// 	): number {
// 		// Calculate the distance between two coordinates using Haversine formula
// 		const earthRadius = 6371000; // Radius of the Earth in meters
// 		const dLat = (lat2 - lat1) * (Math.PI / 180);
// 		const dLon = (lon2 - lon1) * (Math.PI / 180);
// 		const a =
// 			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// 			Math.cos(lat1 * (Math.PI / 180)) *
// 				Math.cos(lat2 * (Math.PI / 180)) *
// 				Math.sin(dLon / 2) *
// 				Math.sin(dLon / 2);
// 		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// 		const distance = earthRadius * c;
// 		return distance;
// 	}

// 	public calculateRideTime(): number {
// 		if (this.rideStartTime && this.rideEndTime) {
// 			return (this.rideEndTime - this.rideStartTime) / 1000;
// 		}
// 		return 0;
// 	}
// }

// import { Component, OnInit } from '@angular/core';
// import { Geolocation, Position } from '@capacitor/geolocation';
// import * as mapboxgl from 'mapbox-gl';
// import { MAPBOX_ACCESS_TOKEN, MAP_STYLE_URL } from '../../../config';

// @Component({
// 	selector: 'app-map',
// 	templateUrl: './map.component.html',
// 	styleUrls: ['./map.component.scss']
// })
// export class MapComponent implements OnInit {
// 	private map!: mapboxgl.Map;
// 	private marker?: mapboxgl.Marker;
// 	private markerVisible = false;
// 	tracking = false;
// 	private watchId?: string | undefined;

// 	// Variables to track ride information
// 	private rideStartTime?: number;
// 	private rideEndTime?: number;
// 	public totalDistance = 0;

// 	// Property to store GeoJSON data
// 	public geojsonData: any = {
// 		type: 'Feature',
// 		properties: {},
// 		geometry: {
// 			type: 'LineString',
// 			coordinates: [] // Initialize with an empty array
// 		}
// 	};

// 	constructor() {}

// 	async ngOnInit(): Promise<void> {
// 		(mapboxgl as any).accessToken = MAPBOX_ACCESS_TOKEN;

// 		this.initializeMap();
// 	}

// 	async toggleMarker() {
// 		if (!this.tracking) {
// 			this.startTracking();
// 		} else {
// 			this.stopTracking();
// 		}
// 	}

// 	private initializeMap() {
// 		this.map = new mapboxgl.Map({
// 			container: 'map',
// 			style: MAP_STYLE_URL,
// 			center: [90.407293, 23.8103],
// 			zoom: 9
// 		});
// 	}

// 	private async getUserLocation(): Promise<Position | undefined> {
// 		try {
// 			const position = await Geolocation.getCurrentPosition({
// 				enableHighAccuracy: true
// 			});
// 			return position;
// 		} catch (error) {
// 			console.error('Error getting user location:', error);
// 			return undefined;
// 		}
// 	}

// 	private addMarkerAndFlyToLocation(latitude: number, longitude: number) {
// 		if (this.marker) {
// 			this.marker.remove();
// 		}

// 		this.marker = new mapboxgl.Marker()
// 			.setLngLat([longitude, latitude])
// 			.addTo(this.map);

// 		this.map.flyTo({
// 			center: [longitude, latitude],
// 			zoom: 16,
// 			speed: 1.5,
// 			curve: 1.4,
// 			essential: true
// 		});

// 		this.markerVisible = true;
// 	}

// 	private async watchUserLocation() {
// 		const options = {
// 			enableHighAccuracy: true,
// 			timeout: 2000,
// 			maximumAge: 0
// 		};

// 		try {
// 			const watchId = await Geolocation.watchPosition(options, (position) => {
// 				if (position && position.coords) {
// 					const { latitude, longitude } = position.coords;
// 					console.log(
// 						`User's current location: Latitude ${latitude}, Longitude ${longitude}`
// 					);

// 					// Calculate and update distance if there is a previous location
// 					if (this.marker && this.markerVisible) {
// 						const prevLocation = this.marker.getLngLat();
// 						const distance = this.calculateDistance(
// 							prevLocation.lng,
// 							prevLocation.lat,
// 							longitude,
// 							latitude
// 						);
// 						this.totalDistance += distance;

// 						// Add the current location to the GeoJSON LineString
// 						this.geojsonData.geometry.coordinates.push([longitude, latitude]);
// 					}

// 					// Save the location as the marker
// 					this.addMarkerAndFlyToLocation(latitude, longitude);
// 				}
// 			});

// 			this.watchId = watchId;
// 		} catch (error) {
// 			console.error('Error watching user location:', error);
// 		}
// 	}

// 	private async stopWatchingUserLocation() {
// 		if (this.watchId) {
// 			await Geolocation.clearWatch({ id: this.watchId });
// 			this.watchId = undefined;
// 		}
// 	}

// 	private async startTracking() {
// 		this.tracking = true;
// 		this.rideStartTime = Date.now();

// 		const position = await this.getUserLocation();

// 		if (position && position.coords) {
// 			const { latitude, longitude } = position.coords;
// 			console.log(
// 				`User's start location: Latitude ${latitude}, Longitude ${longitude}`
// 			);
// 			this.addMarkerAndFlyToLocation(latitude, longitude);

// 			// Create a GeoJSON feature for the starting point
// 			this.geojsonData.geometry.coordinates.push([longitude, latitude]);
// 		}

// 		this.watchUserLocation();
// 	}

// 	private stopTracking() {
// 		this.tracking = false;
// 		this.rideEndTime = Date.now();

// 		if (this.markerVisible) {
// 			this.marker?.remove();
// 			this.markerVisible = false;
// 		}

// 		// Retrieve and display the stop location
// 		const stopLocation = this.marker?.getLngLat();
// 		if (stopLocation) {
// 			const { lat, lng } = stopLocation;
// 			console.log(`User's stop location: Latitude ${lat}, Longitude ${lng}`);

// 			// Create a GeoJSON feature for the stopping point
// 			this.geojsonData.geometry.coordinates.push([lng, lat]);

// 			// Log the entire GeoJSON data
// 			console.log('GeoJSON Data:', JSON.stringify(this.geojsonData, null, 2));
// 		}
// 	}

// 	private calculateDistance(
// 		lat1: number,
// 		lon1: number,
// 		lat2: number,
// 		lon2: number
// 	): number {
// 		// Calculate the distance between two coordinates using Haversine formula
// 		const earthRadius = 6371000; // Radius of the Earth in meters
// 		const dLat = (lat2 - lat1) * (Math.PI / 180);
// 		const dLon = (lon2 - lon1) * (Math.PI / 180);
// 		const a =
// 			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// 			Math.cos(lat1 * (Math.PI / 180)) *
// 				Math.cos(lat2 * (Math.PI / 180)) *
// 				Math.sin(dLon / 2) *
// 				Math.sin(dLon / 2);
// 		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// 		const distance = earthRadius * c;
// 		return distance;
// 	}

// 	public calculateRideTime(): number {
// 		if (this.rideStartTime && this.rideEndTime) {
// 			return (this.rideEndTime - this.rideStartTime) / 1000;
// 		}
// 		return 0;
// 	}
// }

import { Component, OnInit } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import * as mapboxgl from 'mapbox-gl';
import { MAPBOX_ACCESS_TOKEN, MAP_STYLE_URL } from '../../../config';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
	private map!: mapboxgl.Map;
	private marker?: mapboxgl.Marker;
	private markerVisible = false;
	tracking = false;
	private watchId?: string | undefined;

	// Variables to track ride information
	private rideStartTime?: number;
	private rideEndTime?: number;
	public totalDistance = 0;

	// Property to store GeoJSON data
	public geojsonData: any = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: [] // Initialize with an empty array
		}
	};

	constructor() {}

	async ngOnInit(): Promise<void> {
		(mapboxgl as any).accessToken = MAPBOX_ACCESS_TOKEN;

		this.initializeMap();
	}

	async toggleMarker() {
		if (!this.tracking) {
			this.startTracking();
		} else {
			this.stopTracking();
		}
	}

	private initializeMap() {
		this.map = new mapboxgl.Map({
			container: 'map',
			style: MAP_STYLE_URL,
			center: [90.407293, 23.8103],
			zoom: 9
		});
	}

	private async getUserLocation(): Promise<Position | undefined> {
		try {
			const position = await Geolocation.getCurrentPosition({
				enableHighAccuracy: true
			});
			return position;
		} catch (error) {
			console.error('Error getting user location:', error);
			return undefined;
		}
	}

	private addMarkerAndFlyToLocation(latitude: number, longitude: number) {
		if (this.marker) {
			this.marker.remove();
		}

		this.marker = new mapboxgl.Marker()
			.setLngLat([longitude, latitude])
			.addTo(this.map);

		this.map.flyTo({
			center: [longitude, latitude],
			zoom: 16,
			speed: 1.5,
			curve: 1.4,
			essential: true
		});

		this.markerVisible = true;
	}

	private async watchUserLocation() {
		const options = {
			enableHighAccuracy: true,
			timeout: 2000,
			maximumAge: 0
		};

		try {
			const watchId = await Geolocation.watchPosition(options, (position) => {
				if (position && position.coords) {
					const { latitude, longitude } = position.coords;
					console.log(
						`User's current location: Latitude ${latitude}, Longitude ${longitude}`
					);

					// Calculate and update distance if there is a previous location
					if (this.marker && this.markerVisible) {
						const prevLocation = this.marker.getLngLat();
						const distance = this.calculateDistance(
							prevLocation.lng,
							prevLocation.lat,
							longitude,
							latitude
						);
						this.totalDistance += distance;

						// Add the current location to the GeoJSON LineString
						this.geojsonData.geometry.coordinates.push([longitude, latitude]);
					}

					// Save the location as the marker
					this.addMarkerAndFlyToLocation(latitude, longitude);
				}
			});

			this.watchId = watchId;
		} catch (error) {
			console.error('Error watching user location:', error);
		}
	}

	private async stopWatchingUserLocation() {
		if (this.watchId) {
			await Geolocation.clearWatch({ id: this.watchId });
			this.watchId = undefined;
		}
	}

	private async startTracking() {
		this.tracking = true;
		this.rideStartTime = Date.now();

		const position = await this.getUserLocation();

		if (position && position.coords) {
			const { latitude, longitude } = position.coords;
			console.log(
				`User's start location: Latitude ${latitude}, Longitude ${longitude}`
			);
			this.addMarkerAndFlyToLocation(latitude, longitude);

			// Create a GeoJSON feature for the starting point
			this.geojsonData.geometry.coordinates.push([longitude, latitude]);
		}

		this.watchUserLocation();
	}

	private stopTracking() {
		this.tracking = false;
		this.rideEndTime = Date.now();

		if (this.markerVisible) {
			this.marker?.remove();
			this.markerVisible = false;
		}

		// Retrieve and display the stop location
		const stopLocation = this.marker?.getLngLat();
		if (stopLocation) {
			const { lat, lng } = stopLocation;
			console.log(`User's stop location: Latitude ${lat}, Longitude ${lng}`);

			// Create a GeoJSON feature for the stopping point
			this.geojsonData.geometry.coordinates.push([lng, lat]);

			// Log the entire GeoJSON data
			console.log('GeoJSON Data:', JSON.stringify(this.geojsonData, null, 2));

			// Now that you have the GeoJSON data, you can add it to the map as a source and layer
			this.addGeoJSONToMap();
		}
		this.stopWatchingUserLocation();
	}

	private addGeoJSONToMap() {
		// Check if the 'route' source exists; if not, add it
		if (!this.map.getSource('route')) {
			this.map.addSource('route', {
				type: 'geojson',
				data: this.geojsonData
			});
		} else {
			// Update the existing source with the new data
			const routeSource = this.map.getSource('route') as mapboxgl.GeoJSONSource;
			routeSource.setData(this.geojsonData);
		}

		// Check if the 'route' layer exists; if not, add it
		if (!this.map.getLayer('route')) {
			this.map.addLayer({
				id: 'route',
				type: 'line',
				source: 'route',
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#888',
					'line-width': 8
				}
			});
		}
	}

	private calculateDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number {
		// Calculate the distance between two coordinates using Haversine formula
		const earthRadius = 6371000; // Radius of the Earth in meters
		const dLat = (lat2 - lat1) * (Math.PI / 180);
		const dLon = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = earthRadius * c;
		return distance;
	}

	public calculateRideTime(): number {
		if (this.rideStartTime && this.rideEndTime) {
			return (this.rideEndTime - this.rideStartTime) / 1000;
		}
		return 0;
	}

	fitToBounds() {
		const coordinates = this.geojsonData?.geometry?.coordinates;

		if (!coordinates || coordinates.length === 0) {
			console.error('No coordinates to fit bounds to.');
			return;
		}

		const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

		for (const coord of coordinates) {
			bounds.extend(coord);
		}

		if (!this.map) {
			console.error('Map is not initialized.');
			return;
		}

		this.map.fitBounds(bounds, {
			padding: 20
		});

		console.log('Fitting bounds to:', bounds);
	}
}
