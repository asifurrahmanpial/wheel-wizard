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

// 			// Now that you have the GeoJSON data, you can add it to the map as a source and layer
// 			this.addGeoJSONToMap();
// 		}
// 		this.stopWatchingUserLocation();

// 		const coordinates = this.geojsonData.geometry.coordinates;

// 		// Update the map in real-time by continuously adding coordinates
// 		let i = 0;
// 		const timer = setInterval(() => {
// 			if (i < coordinates.length) {
// 				// Update the 'route' source with the new data
// 				const updatedData: GeoJSON.Feature<GeoJSON.LineString> = {
// 					type: 'Feature',
// 					properties: {},
// 					geometry: {
// 						type: 'LineString',
// 						coordinates: coordinates.slice(0, i + 1)
// 					}
// 				};

// 				// Check if the 'route' source exists; if not, add it
// 				if (!this.map.getSource('route')) {
// 					this.map.addSource('route', {
// 						type: 'geojson',
// 						data: updatedData
// 					});
// 				} else {
// 					// Update the existing source with the new data
// 					const routeSource = this.map.getSource(
// 						'route'
// 					) as mapboxgl.GeoJSONSource;
// 					routeSource.setData(updatedData);
// 				}

// 				// Pan the map to the latest coordinates
// 				this.map.panTo(coordinates[i]);
// 				i++;
// 			} else {
// 				clearInterval(timer);
// 			}
// 		}, 1000); // Adjust the interval as needed
// 	}

// 	private addGeoJSONToMap() {
// 		// Check if the 'route' source exists; if not, add it
// 		if (!this.map.getSource('route')) {
// 			this.map.addSource('route', {
// 				type: 'geojson',
// 				data: this.geojsonData
// 			});
// 		} else {
// 			// Update the existing source with the new data
// 			const routeSource = this.map.getSource('route') as mapboxgl.GeoJSONSource;
// 			routeSource.setData(this.geojsonData);
// 		}

// 		// Check if the 'route' layer exists; if not, add it
// 		if (!this.map.getLayer('route')) {
// 			this.map.addLayer({
// 				id: 'route',
// 				type: 'line',
// 				source: 'route',
// 				layout: {
// 					'line-join': 'round',
// 					'line-cap': 'round'
// 				},
// 				paint: {
// 					'line-color': '#888',
// 					'line-width': 8
// 				}
// 			});
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

// 	fitToBounds() {
// 		const coordinates = this.geojsonData?.geometry?.coordinates;

// 		if (!coordinates || coordinates.length === 0) {
// 			console.error('No coordinates to fit bounds to.');
// 			return;
// 		}

// 		const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

// 		for (const coord of coordinates) {
// 			bounds.extend(coord);
// 		}

// 		if (!this.map) {
// 			console.error('Map is not initialized.');
// 			return;
// 		}

// 		this.map.fitBounds(bounds, {
// 			padding: 20
// 		});

// 		console.log('Fitting bounds to:', bounds);
// 	}
// }

// service area

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
// 			type: 'Polygon',
// 			coordinates: [
// 				[
// 					[90.35892535035822, 23.73026803278084],
// 					[90.35520837612711, 23.741986116751818],
// 					[90.35664893945409, 23.75627514237472],
// 					[90.37305368023294, 23.760285068091434],
// 					[90.38742786820114, 23.750902124253813],
// 					[90.39116505525789, 23.738605801049147],
// 					[90.39228358878836, 23.715910635726928],
// 					[90.38384621283393, 23.713632613448837],
// 					[90.36976908063457, 23.724745099707334],
// 					[90.35892535035822, 23.73026803278084]
// 				]
// 			]
// 		}
// 	};

// 	constructor() {}

// 	async ngOnInit(): Promise<void> {
// 		(mapboxgl as any).accessToken = MAPBOX_ACCESS_TOKEN;

// 		this.initializeMap();
// 	}

// 	// Toggle marker tracking on the map
// 	async toggleMarker() {
// 		if (!this.tracking) {
// 			this.startTracking();
// 		} else {
// 			this.stopTracking();
// 		}
// 	}

// 	// Initialize the Mapbox map
// 	private initializeMap() {
// 		this.map = new mapboxgl.Map({
// 			container: 'map',
// 			style: MAP_STYLE_URL,
// 			center: [90.407293, 23.8103],
// 			zoom: 9
// 		});

// 		// Add the GeoJSON source and layers
// 		this.map.on('load', () => {
// 			this.map.addSource('maine', {
// 				type: 'geojson',
// 				data: this.geojsonData
// 			});

// 			this.map.addLayer({
// 				id: 'maine',
// 				type: 'fill',
// 				source: 'maine',
// 				layout: {},
// 				paint: {
// 					'fill-color': '#0080ff',
// 					'fill-opacity': 0.5
// 				}
// 			});

// 			this.map.addLayer({
// 				id: 'outline',
// 				type: 'line',
// 				source: 'maine',
// 				layout: {},
// 				paint: {
// 					'line-color': '#000',
// 					'line-width': 3
// 				}
// 			});

// 			// Add a custom marker
// 			this.addCustomMarker(
// 				[90.36270595295844, 23.732303975895746],
// 				'Cycle 1, cost 15tk/min'
// 			);
// 		});
// 	}

// 	// Add a custom marker at the specified location with the given text
// 	private addCustomMarker(coordinates: [number, number], text: string) {
// 		const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(text);

// 		this.marker = new mapboxgl.Marker()
// 			.setLngLat(coordinates)
// 			.setPopup(popup)
// 			.addTo(this.map);
// 	}

// 	// Get the user's current location
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

// 	// Add a marker on the map and fly to the location
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

// 	// Watch the user's location and update the map in real-time
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

// 	// Stop watching the user's location
// 	private async stopWatchingUserLocation() {
// 		if (this.watchId) {
// 			await Geolocation.clearWatch({ id: this.watchId });
// 			this.watchId = undefined;
// 		}
// 	}

// 	// Start tracking the user's location
// 	private async startTracking() {
// 		this.tracking = true;
// 		this.rideStartTime = Date.now();

// 		const position = await this.getUserLocation();

// 		if (position && position.coords) {
// 			const { latitude, longitude } = position.coords;
// 			this.addMarkerAndFlyToLocation(latitude, longitude);

// 			// Create a GeoJSON feature for the starting point
// 			this.geojsonData.geometry.coordinates.push([longitude, latitude]);
// 		}

// 		this.watchUserLocation();
// 	}

// 	// Stop tracking the user's location
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

// 			// Create a GeoJSON feature for the stopping point
// 			this.geojsonData.geometry.coordinates.push([lng, lat]);

// 			// Log the entire GeoJSON data
// 			console.log('GeoJSON Data:', JSON.stringify(this.geojsonData, null, 2));

// 			// Now that you have the GeoJSON data, you can add it to the map as a source and layer
// 			this.addGeoJSONToMap();
// 		}
// 		this.stopWatchingUserLocation();

// 		// Update the map in real-time by continuously adding coordinates
// 		// Update the map in real-time by continuously adding coordinates
// 		const coordinates = this.geojsonData.geometry.coordinates;
// 		let i = 0;
// 		const timer = setInterval(() => {
// 			if (i < coordinates.length) {
// 				const [longitude, latitude] = coordinates[i];

// 				const updatedData: GeoJSON.Feature<GeoJSON.LineString> = {
// 					type: 'Feature',
// 					properties: {},
// 					geometry: {
// 						type: 'LineString',
// 						coordinates: coordinates.slice(0, i + 1)
// 					}
// 				};

// 				if (!this.map.getSource('route')) {
// 					this.map.addSource('route', {
// 						type: 'geojson',
// 						data: updatedData
// 					});
// 				} else {
// 					const routeSource = this.map.getSource(
// 						'route'
// 					) as mapboxgl.GeoJSONSource;
// 					routeSource.setData(updatedData);
// 				}

// 				this.map.panTo({ lng: longitude, lat: latitude }); // Correct format

// 				i++;
// 			} else {
// 				clearInterval(timer);
// 			}
// 		}, 1000); // Adjust the interval as needed
// 		// Adjust the interval as needed
// 	}

// 	// Add the GeoJSON data to the map as a source and layer
// 	private addGeoJSONToMap() {
// 		if (!this.map.getSource('route')) {
// 			this.map.addSource('route', {
// 				type: 'geojson',
// 				data: this.geojsonData
// 			});
// 		} else {
// 			const routeSource = this.map.getSource('route') as mapboxgl.GeoJSONSource;
// 			routeSource.setData(this.geojsonData);
// 		}

// 		if (!this.map.getLayer('route')) {
// 			this.map.addLayer({
// 				id: 'route',
// 				type: 'line',
// 				source: 'route',
// 				layout: {
// 					'line-join': 'round',
// 					'line-cap': 'round'
// 				},
// 				paint: {
// 					'line-color': '#888',
// 					'line-width': 8
// 				}
// 			});
// 		}
// 	}

// 	// Calculate the distance between two coordinates using Haversine formula
// 	private calculateDistance(
// 		lat1: number,
// 		lon1: number,
// 		lat2: number,
// 		lon2: number
// 	): number {
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

// 	// Calculate the ride time in seconds
// 	public calculateRideTime(): number {
// 		if (this.rideStartTime && this.rideEndTime) {
// 			return (this.rideEndTime - this.rideStartTime) / 1000;
// 		}
// 		return 0;
// 	}

// 	// Fit the map bounds to the coordinates
// 	fitToBounds() {
// 		const coordinates = this.geojsonData?.geometry?.coordinates;

// 		if (!coordinates || coordinates.length === 0) {
// 			console.error('No coordinates to fit bounds to.');
// 			return;
// 		}

// 		const bounds = new mapboxgl.LngLatBounds();

// 		coordinates.forEach((coord: [number, number]) => {
// 			bounds.extend(coord);
// 		});

// 		if (!this.map) {
// 			console.error('Map is not initialized.');
// 			return;
// 		}

// 		this.map.fitBounds(bounds, {
// 			padding: 20
// 		});

// 		console.log('Fitting bounds to:', bounds);
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

	// Toggle marker tracking on the map
	async toggleMarker() {
		if (!this.tracking) {
			this.startTracking();
		} else {
			this.stopTracking();
		}
	}

	// Initialize the Mapbox map
	private initializeMap() {
		this.map = new mapboxgl.Map({
			container: 'map',
			style: MAP_STYLE_URL,
			center: [90.407293, 23.8103],
			zoom: 9
		});
	}

	// Get the user's current location
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

	// Add a marker on the map and fly to the location
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

	// Watch the user's location and update the map in real-time
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

	// Stop watching the user's location
	private async stopWatchingUserLocation() {
		if (this.watchId) {
			await Geolocation.clearWatch({ id: this.watchId });
			this.watchId = undefined;
		}
	}

	// Start tracking the user's location
	private async startTracking() {
		this.tracking = true;
		this.rideStartTime = Date.now();

		const position = await this.getUserLocation();

		if (position && position.coords) {
			const { latitude, longitude } = position.coords;
			this.addMarkerAndFlyToLocation(latitude, longitude);

			// Create a GeoJSON feature for the starting point
			this.geojsonData.geometry.coordinates.push([longitude, latitude]);
		}

		this.watchUserLocation();
	}

	// Stop tracking the user's location
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

			// Create a GeoJSON feature for the stopping point
			this.geojsonData.geometry.coordinates.push([lng, lat]);

			// Log the entire GeoJSON data
			console.log('GeoJSON Data:', JSON.stringify(this.geojsonData, null, 2));

			// Now that you have the GeoJSON data, you can add it to the map as a source and layer
			this.addGeoJSONToMap();
		}
		this.stopWatchingUserLocation();

		// Update the map in real-time by continuously adding coordinates
		const coordinates = this.geojsonData.geometry.coordinates;
		let i = 0;
		const timer = setInterval(() => {
			if (i < coordinates.length) {
				const updatedData: GeoJSON.Feature<GeoJSON.LineString> = {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: coordinates.slice(0, i + 1)
					}
				};

				if (!this.map.getSource('route')) {
					this.map.addSource('route', {
						type: 'geojson',
						data: updatedData
					});
				} else {
					const routeSource = this.map.getSource(
						'route'
					) as mapboxgl.GeoJSONSource;
					routeSource.setData(updatedData);
				}

				this.map.panTo(coordinates[i]);
				i++;
			} else {
				clearInterval(timer);
			}
		}, 1000); // Adjust the interval as needed
	}

	// Add the GeoJSON data to the map as a source and layer
	private addGeoJSONToMap() {
		if (!this.map.getSource('route')) {
			this.map.addSource('route', {
				type: 'geojson',
				data: this.geojsonData
			});
		} else {
			const routeSource = this.map.getSource('route') as mapboxgl.GeoJSONSource;
			routeSource.setData(this.geojsonData);
		}

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

	// Calculate the distance between two coordinates using Haversine formula
	private calculateDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number {
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

	// Calculate the ride time in seconds
	public calculateRideTime(): number {
		if (this.rideStartTime && this.rideEndTime) {
			return (this.rideEndTime - this.rideStartTime) / 1000;
		}
		return 0;
	}

	// Fit the map bounds to the coordinates
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
