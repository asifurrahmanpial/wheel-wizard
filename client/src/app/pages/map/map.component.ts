import { Component, OnInit } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import * as turf from '@turf/turf';
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

	// Property to store GeoJSON data for LineString
	public lineStringData: any = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: []
		}
	};

	// Geojson Polygon For Dhanmondi Service Area
	public dhanmondiPolygonData: any = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [
				[
					[90.35892535035822, 23.73026803278084],
					[90.35520837612711, 23.741986116751818],
					[90.35664893945409, 23.75627514237472],
					[90.37305368023294, 23.760285068091434],
					[90.38742786820114, 23.750902124253813],
					[90.39116505525789, 23.738605801049147],
					[90.39228358878836, 23.715910635726928],
					[90.38384621283393, 23.713632613448837],
					[90.36976908063457, 23.724745099707334],
					[90.35892535035822, 23.73026803278084]
				]
			]
		}
	};

	// Geojson Polygon For Gulshan Service Area
	public gulshanPolygonData: any = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [
				[
					[90.41069757560575, 23.79680223178086],
					[90.41591465744375, 23.799395564120303],
					[90.42059268924055, 23.79049337898222],
					[90.41482858798452, 23.787121694309377],
					[90.4115132497426, 23.79156291255778],
					[90.41069757560575, 23.79680223178086]
				]
			]
		}
	};

	constructor() {}

	ngOnInit() {
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
			accessToken: MAPBOX_ACCESS_TOKEN,
			container: 'map',
			style: MAP_STYLE_URL,
			center: [90.407293, 23.8103],
			zoom: 9
		});

		this.map.on('load', () => {
			// Add the LineString source and layer
			this.map.addSource('line-string-source', {
				type: 'geojson',
				data: this.lineStringData
			});

			this.map.addLayer({
				id: 'line-string-layer',
				type: 'line',
				source: 'line-string-source',
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#888',
					'line-width': 8
				}
			});

			// Add the "dhanmondiPolygonData" source and layer
			this.map.addSource('dhanmondi-polygon-source', {
				type: 'geojson',
				data: this.dhanmondiPolygonData
			});

			this.map.addLayer({
				id: 'dhanmondi-polygon-layer',
				type: 'fill',
				source: 'dhanmondi-polygon-source',
				paint: {
					'fill-color': '#00FF00', // Customize fill color
					'fill-opacity': 0.6
				}
			});

			// Add the "gulshanPolygonData" source and layer
			this.map.addSource('gulshan-polygon-source', {
				type: 'geojson',
				data: this.gulshanPolygonData
			});

			this.map.addLayer({
				id: 'gulshan-polygon-layer',
				type: 'fill',
				source: 'gulshan-polygon-source',
				paint: {
					'fill-color': '#00FF00', // Customize fill color
					'fill-opacity': 0.6
				}
			});
		});

		this.addCycleMarker(
			[90.36270595295844, 23.732303975895746],
			'Cycle 1, cost 15tk/min'
		);
		this.addCycleMarker([90.415, 23.798], 'Cycle 2, cost 20tk/min');
	}

	private addCycleMarker(coordinates: [number, number], text: string) {
		const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(text);

		this.marker = new mapboxgl.Marker()
			.setLngLat(coordinates)
			.setPopup(popup)
			.addTo(this.map);
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
						this.lineStringData.geometry.coordinates.push([
							longitude,
							latitude
						]);
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
			this.lineStringData.geometry.coordinates.push([longitude, latitude]);
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
			this.lineStringData.geometry.coordinates.push([lng, lat]);

			// Log the entire GeoJSON data
			console.log(
				'GeoJSON Data:',
				JSON.stringify(this.lineStringData, null, 2)
			);

			// Now that you have the GeoJSON data, you can add it to the map as a source and layer
			this.addGeoJSONToMap();
		}

		// Update the map in real-time by continuously adding coordinates
		const coordinates = this.lineStringData.geometry.coordinates;
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
				data: this.lineStringData
			});
		} else {
			const routeSource = this.map.getSource('route') as mapboxgl.GeoJSONSource;
			routeSource.setData(this.lineStringData);
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
		const point1 = turf.point([lon1, lat1]);
		const point2 = turf.point([lon2, lat2]);
		const options = { units: 'kilometers' as turf.Units };
		const distance = turf.length(
			turf.lineString([
				point1.geometry.coordinates,
				point2.geometry.coordinates
			]),
			options
		);
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
		const coordinates = this.lineStringData?.geometry?.coordinates;

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
