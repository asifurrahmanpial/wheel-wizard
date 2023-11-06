import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation, Position } from '@capacitor/geolocation';
import { supported } from '@mapbox/mapbox-gl-supported';
import * as turf from '@turf/turf';
import * as mapboxgl from 'mapbox-gl';
import { GeolocationService } from 'src/app/services/location.service';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QrScannerService } from 'src/app/services/qrScannerService.service';
import html2canvas from 'html2canvas';
import { ParamMap } from '@angular/router';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnInit {
	private map!: mapboxgl.Map;
	private flyToMarker!: mapboxgl.Marker;
	style = environment.mapbox.MAP_STYLE_URL;
	center: [lat: number, lng: number] = [90.4152, 23.8041];
	private vehicleMarkers: { [title: string]: mapboxgl.Marker } = {};
	watchID: any;
	isUserTracked = false;
	hasBookedRide: boolean = false;
	isTracking = false;
	public distance: string = '0';
	public duration: number = 0;
	public startTime!: Date;
	public endTime!: Date;
	public fare: number = 0;
	public vehicleType!: string;
	private realTimeUpdateInterval: any;
	vehicleData: any;
	serviceZoneCheckInterval: any;
	private features: GeoJSON.Feature[] = [];
	currentLocation!: mapboxgl.LngLatLike;
	private vehicleLayersAndSources: string[] = [];

	constructor(
		private geolocationService: GeolocationService,
		private router: Router,
		private snackBar: MatSnackBar,
		private qrScannerService: QrScannerService,
		private zone: NgZone,
		private route: ActivatedRoute
	) {
		const navigation = this.router.getCurrentNavigation();
		if (navigation && navigation.extras.state) {
			this.hasBookedRide = navigation.extras.state['hasBookedRide'];
		}
	}

	ngAfterViewInit() {
		if (supported()) {
			this.initializeMapAndLayers().then(() => {
				this.getUserLocation();
			});
		} else {
			console.error('WebGL is not supported.');
		}
	}

	ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			const state = window.history.state;
			if (state && state.vehicleData) {
				this.vehicleData = state.vehicleData;
				this.vehicleType = this.vehicleData.vehicleType;
			}
		});
	}

	async initializeMapAndLayers() {
		return new Promise<void>((resolve) => {
			const mapContainer = document.getElementById('map');

			if (mapContainer) {
				mapContainer.innerHTML = '';
			}

			this.map = new mapboxgl.Map({
				accessToken: environment.mapbox.MAPBOX_ACCESS_TOKEN,
				container: 'map',
				style: this.style,
				zoom: 11,
				center: this.center
			});

			this.map.on('load', () => {
				this.map.addSource('earthquakes', {
					type: 'geojson',
					data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
				});

				this.map.addSource('service-zone', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: [
							{
								type: 'Feature',
								properties: { propertyName: 'Dhanmondi' },
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
							},
							{
								type: 'Feature',
								properties: { propertyName: 'Gulshan 2' },
								geometry: {
									type: 'Polygon',
									coordinates: [
										[
											[90.41069757560575, 23.79680223178086],
											[90.41591465744375, 23.799395564120303],
											[90.42154656002418, 23.79224047027232],
											[90.42059268924055, 23.79149337898222],
											[90.41482858798452, 23.787121694309377],
											[90.41069757560575, 23.79680223178086]
										]
									]
								}
							}
						]
					}
				});

				this.map.addLayer({
					id: 'service-zone-color',
					type: 'fill',
					source: 'service-zone',
					layout: {},
					paint: {
						'fill-color': '#1cdb63',
						'fill-opacity': 0.5
					}
				});

				this.map.addLayer({
					id: 'outline',
					type: 'line',
					source: 'service-zone',
					layout: {},
					paint: {
						'line-color': '#000',
						'line-width': 3
					}
				});

				this.map.addLayer({
					id: 'earthquakes-layer',
					type: 'circle',
					source: 'earthquakes',
					paint: {
						'circle-radius': 4,
						'circle-stroke-width': 2,
						'circle-color': 'red',
						'circle-stroke-color': 'white'
					}
				});
				resolve();
			});
		});
	}

	async isUserInServiceZone(lngLat: mapboxgl.LngLatLike): Promise<boolean> {
		if (!lngLat) {
			return false;
		}

		const features = this.map.queryRenderedFeatures(this.map.project(lngLat), {
			layers: ['service-zone-color']
		});

		return features.length > 0;
	}

	async getUserLocation(): Promise<Position | undefined> {
		this.vehicleLayersAndSources.forEach((id) => {
			if (this.map.getLayer(id)) {
				this.map.removeLayer(id);
			}
			if (this.map.getSource(id)) {
				this.map.removeSource(id);
			}
		});
		this.vehicleLayersAndSources = [];
		if (!this.map) {
			await this.initializeMapAndLayers();
		}

		try {
			const position = await Geolocation.getCurrentPosition({
				enableHighAccuracy: true
			});

			if (position) {
				const { longitude, latitude } = position.coords;
				const lngLat: mapboxgl.LngLatLike = [longitude, latitude];

				console.log('User location:', position);
				this.isUserTracked = true;
				this.flyToPosition(lngLat, true);
				if (!this.isTracking) {
					const nearestVehicleData = this.findVehiclesWithinRadius(lngLat, [
						{
							coordinates: [90.3602676, 23.7338588],
							title: 'Scooter Two',
							vehicleType: 'scooter',
							serviceZone: 'Dhanmondi'
						},
						{
							coordinates: [90.36270595295844, 23.732303975895746],
							title: 'Cycle One',
							vehicleType: 'cycle',
							serviceZone: 'Dhanmondi'
						},
						{
							coordinates: [90.415, 23.798],
							title: 'Scooter One',
							vehicleType: 'scooter',
							serviceZone: 'Gulshan 2'
						},
						{
							coordinates: [90.41940936417484, 23.792966936767243],
							title: 'Scooter Three',
							vehicleType: 'scooter',
							serviceZone: 'Gulshan 2'
						}
					]);
					if (nearestVehicleData && nearestVehicleData.length > 0) {
						console.log('Nearby vehicles:', nearestVehicleData);
						nearestVehicleData.forEach((vehicle) => {
							this.addVehicleMarker(vehicle);
						});
					} else {
						console.log('No vehicles found within the specified radius.');
					}
				}
			} else {
				console.error('Geolocation.getCurrentPosition returned no position.');
			}

			return position;
		} catch (error) {
			console.error('Error getting user location:', error);
			return undefined;
		}
	}

	findVehiclesWithinRadius(
		userLocation: [number, number],
		vehicleData: {
			coordinates: [number, number];
			title: string;
			vehicleType: 'scooter' | 'cycle';
			serviceZone: 'Dhanmondi' | 'Gulshan 2';
		}[],
		radius: number = 1
	): {
		coordinates: [number, number];
		title: string;
		vehicleType: 'scooter' | 'cycle';
		serviceZone: 'Dhanmondi' | 'Gulshan 2';
	}[] {
		const userPoint = turf.point(userLocation);
		const vehiclePoints = turf.featureCollection(
			vehicleData.map((data) => {
				return turf.point(data.coordinates, {
					title: data.title,
					vehicleType: data.vehicleType,
					serviceZone: data.serviceZone
				});
			})
		);

		const nearbyVehicles = vehiclePoints.features.filter((feature) => {
			const distance = turf.distance(userPoint, feature);
			return distance <= radius;
		});

		return nearbyVehicles.map((vehicle) => {
			const coordinates = vehicle.geometry.coordinates;
			return {
				coordinates: [coordinates[0], coordinates[1]],
				title: vehicle.properties['title'],
				vehicleType: vehicle.properties['vehicleType'],
				serviceZone: vehicle.properties['serviceZone']
			};
		});
	}

	addVehicleMarker(vehicleData: {
		coordinates: [number, number];
		title: string;
		vehicleType: 'scooter' | 'cycle';
		serviceZone: 'Dhanmondi' | 'Gulshan 2';
	}) {
		const sourceId = `Vehicles-${vehicleData.title}`;
		const imageId = vehicleData.vehicleType;
		const layerId = `Vehicles-points-${vehicleData.title}`;

		// Step 2: Before adding a new layer or source, check if it already exists in the map. If it does, remove it.
		if (this.map.getLayer(layerId)) {
			this.map.removeLayer(layerId);
			this.vehicleLayersAndSources = this.vehicleLayersAndSources.filter(
				(id) => id !== layerId
			);
		}

		if (this.map.getSource(sourceId)) {
			this.map.removeSource(sourceId);
			this.vehicleLayersAndSources = this.vehicleLayersAndSources.filter(
				(id) => id !== sourceId
			);
		}

		let fare;
		if (vehicleData.vehicleType === 'scooter') {
			fare = 20;
		} else if (vehicleData.vehicleType === 'cycle') {
			fare = 10;
		}

		if (this.map.getLayer(layerId)) {
			this.map.removeLayer(layerId);
		}

		if (this.map.getSource(sourceId)) {
			this.map.removeSource(sourceId);
		}

		this.map.addSource(sourceId, {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: vehicleData.coordinates
						},
						properties: {
							title: vehicleData.title,
							vehicleType: vehicleData.vehicleType,
							serviceZone: vehicleData.serviceZone,
							fare: fare
						}
					}
				]
			}
		});

		const imagePath =
			vehicleData.vehicleType === 'scooter'
				? 'assets/scooter.png'
				: vehicleData.vehicleType === 'cycle'
				? 'assets/cycle.png'
				: 'assets/marker.svg';

		this.map.loadImage(imagePath, (imageError, markerImage) => {
			if (imageError) throw imageError;

			if (markerImage) {
				if (this.map.hasImage(imageId)) {
					this.map.removeImage(imageId);
				}

				this.map.addImage(imageId, markerImage);

				this.map.addLayer({
					id: layerId,
					type: 'symbol',
					source: sourceId,
					layout: {
						'icon-image': imageId,
						'icon-size': 0.2
					}
				});
			}
		});
		this.vehicleLayersAndSources.push(layerId);
		this.vehicleLayersAndSources.push(sourceId);
		this.setupVehicleMarkerClickEvent(layerId);
	}

	setupVehicleMarkerClickEvent(layerId: string) {
		this.map.on('click', layerId, (e) => {
			if (e.features && e.features.length > 0) {
				const pointFeature = e.features[0] as GeoJSON.Feature<GeoJSON.Point>;

				if (
					pointFeature &&
					pointFeature.geometry &&
					pointFeature.geometry.coordinates.length >= 2
				) {
					const coordinates: [number, number] = [
						pointFeature.geometry.coordinates[0],
						pointFeature.geometry.coordinates[1]
					];
					const title = e.features[0].properties?.['title'];
					const fare = e.features[0].properties?.['fare'];
					const vehicleType = e.features[0].properties?.['vehicleType'];
					const serviceZone = e.features[0].properties?.['serviceZone'];

					const vehicleData = {
						coordinates,
						title,
						vehicleType,
						serviceZone,
						fare
					};

					const popupContent = document.createElement('div');
					popupContent.innerHTML = `
                    <div class="flex flex-col items-center justify-center">
                        <h3 class="text-xl font-bold">${title}</h3>
                        <p>Fare: ${fare} tk/min</p> <!-- Display the fare -->
                        <button id="book-button" class="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Book</button>
                    </div>`;

					const bookButton = popupContent.querySelector('#book-button');

					if (bookButton) {
						bookButton.addEventListener('click', () => {
							this.qrScannerService.scanQRCode(vehicleData);
						});
					}

					new mapboxgl.Popup()
						.setLngLat(coordinates)
						.setDOMContent(popupContent)
						.addTo(this.map);
				}
			}
		});

		this.map.on('mouseenter', layerId, () => {
			this.map.getCanvas().style.cursor = 'pointer';
		});

		this.map.on('mouseleave', layerId, () => {
			this.map.getCanvas().style.cursor = '';
		});
	}

	public realtimeLineString: any = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: []
		}
	};

	async trackLocation() {
		try {
			const watchId = await Geolocation.watchPosition(
				{ enableHighAccuracy: true },
				(position: Position | null) => {
					this.zone.runOutsideAngular(() => {
						console.log('Position:', position);
						if (position) {
							const lngLat: [number, number] = [
								position.coords.longitude,
								position.coords.latitude
							];
							this.currentLocation = lngLat;
							console.log('lngLat:', lngLat);
							this.flyToPosition(lngLat, true);

							this.realtimeLineString.geometry.coordinates.push(lngLat);
							console.log('realtimeLineString:', this.realtimeLineString);

							if (this.map.getSource('realtimeLineString')) {
								(
									this.map.getSource(
										'realtimeLineString'
									) as mapboxgl.GeoJSONSource
								).setData(this.realtimeLineString);
							} else {
								this.map.addSource('realtimeLineString', {
									type: 'geojson',
									data: this.realtimeLineString
								});

								this.map.addLayer({
									id: 'realtimeLineString',
									type: 'line',
									source: 'realtimeLineString',
									layout: {
										'line-join': 'round',
										'line-cap': 'round'
									},
									paint: {
										'line-color': '#ff0000',
										'line-width': 5
									}
								});
							}
						}
					});
				}
			);
			console.log('watchId:', watchId);
			this.watchID = watchId;
		} catch (error) {
			console.log('Error:', error);
			console.log('Geolocation is not supported or permission denied.');
		}
	}

	stopTracking() {
		console.log('realtimeLineString:', this.realtimeLineString);
		this.isTracking = false;
		this.endTime = new Date();
		this.onLineStringChange();
		if (this.watchID) {
			Geolocation.clearWatch({ id: this.watchID });
			this.watchID = null;

			const coordinates: [number, number][] =
				this.realtimeLineString.geometry.coordinates;
			const initialLngLat: [number, number] = [
				coordinates[0][0],
				coordinates[0][1]
			];
			const bounds = coordinates.reduce(
				(bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
					return bounds.extend(coord);
				},
				new mapboxgl.LngLatBounds(initialLngLat, initialLngLat)
			);

			this.map.fitBounds(bounds, { padding: 55 });

			const duration = this.endTime.getTime() - this.startTime.getTime();

			// Create the ride details object
			const rideDetails = {
				geojson: this.realtimeLineString,
				fare: this.fare,
				startTime: this.startTime,
				endTime: this.endTime,
				duration: duration,
				distance: this.distance
			};

			console.log('Ride details:', rideDetails);
			this.router.navigate(['/ride-summary'], { state: { data: rideDetails } });

			// this.sendRideDetails(rideDetails);
		}
	}

	// async sendRideDetails(rideDetails: any) {
	// 	try {
	// 		const response = await fetch('/ride-details', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify(rideDetails)
	// 		});

	// 		console.log('Response:', response);
	// 	} catch (error) {
	// 		console.error('Error:', error);
	// 	}
	// }

	updateRealTimeInfo() {
		if (this.isTracking) {
			const currentTime = new Date();
			const { length, time } = this.calculateLengthAndTime(
				this.startTime,
				currentTime
			);
			this.distance = length;
			this.duration = +time;
			this.calculateFare(this.duration);
		}
	}

	startTracking() {
		this.removeAllVehicles();
		this.startTime = new Date();
		this.isTracking = true;
		this.trackLocation();

		this.realTimeUpdateInterval = setInterval(() => {
			this.updateRealTimeInfo();
		}, 1000);

		let wasInServiceZone = true;

		// Check if user is in service zone every 5 seconds
		this.serviceZoneCheckInterval = setInterval(async () => {
			const isInServiceZone = await this.isUserInServiceZone(
				this.currentLocation
			);
			if (!isInServiceZone && wasInServiceZone) {
				this.snackBar.open('⚠️ You are leaving the service zone!', '', {
					duration: 3000
				});
			}
			wasInServiceZone = isInServiceZone;
		}, 5000);
	}

	removeAllVehicles() {
		for (let i = 0; i < this.vehicleLayersAndSources.length; i += 2) {
			const layerId = this.vehicleLayersAndSources[i];
			const sourceId = this.vehicleLayersAndSources[i + 1];
			if (this.map.getLayer(layerId)) {
				this.map.removeLayer(layerId);
			}
			if (this.map.getSource(sourceId)) {
				this.map.removeSource(sourceId);
			}
		}
		this.vehicleLayersAndSources = [];
	}

	onLineStringChange() {
		const { length, time } = this.calculateLengthAndTime(
			this.startTime,
			this.endTime
		);
		this.zone.run(() => {
			this.distance = length;
			this.duration = +time;
		});
	}

	calculateFare(timeInSeconds: number) {
		this.zone.run(() => {
			const durationInMinutes = timeInSeconds / 60;
			if (this.vehicleType === 'cycle') {
				this.fare = durationInMinutes * 10;
			} else if (this.vehicleType === 'scooter') {
				this.fare = durationInMinutes * 20;
			}
		});
	}

	public calculateLengthAndTime(
		startTime: Date,
		endTime: Date
	): { length: string; time: number } {
		const lineLength = turf.length(this.realtimeLineString, {
			units: 'kilometers'
		});

		const totalTime = endTime.getTime() - startTime.getTime();

		const timeInSeconds = Math.floor(totalTime / 1000);

		const formattedLength = this.formatDistance(lineLength);

		return { length: formattedLength, time: timeInSeconds };
	}

	public getFormattedTime(timeInSeconds: number): string {
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
		const seconds = timeInSeconds - hours * 3600 - minutes * 60;

		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	}

	public formatDistance(distanceInKilometers: number): string {
		if (!distanceInKilometers) {
			return '0';
		}
		return distanceInKilometers.toFixed(2);
	}

	async flyToPosition(location: mapboxgl.LngLatLike, showMarker = false) {
		await this.map.flyTo({
			center: location,
			zoom: 16,
			speed: 1.5,
			curve: 1.4,
			essential: true
		});

		const el = document.createElement('div');
		el.className = 'custom-marker';
		el.style.width = '50px';
		el.style.height = '50px';
		el.innerHTML = `<svg width="30" height="30" viewbox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" > <circle cx="20" cy="20" fill="none" r="10" stroke="#19a2fc" stroke-width="2"> <animate attributeName="r" from="8" to="20" dur="1.5s" begin="0s" repeatCount="indefinite" /> <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" /> </circle> <circle cx="20" cy="20" fill="#1ba3fd" r="10" /> </svg>`;

		const customMarker = new mapboxgl.Marker(el);

		if (showMarker) {
			this.removeFlyToMarker();
			this.flyToMarker = customMarker;
			this.flyToMarker.setLngLat(location).addTo(this.map);
		} else {
			this.removeFlyToMarker();
		}
	}

	private removeFlyToMarker() {
		if (this.flyToMarker) {
			this.flyToMarker.remove();
		}
	}
}
