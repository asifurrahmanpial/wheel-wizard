import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LocationService {
	private storageKey = 'userLocation';

	constructor() {}

	saveLocation(location: { latitude: number; longitude: number }) {
		localStorage.setItem(this.storageKey, JSON.stringify(location));
	}

	getLocation(): { latitude: number; longitude: number } | null {
		const storedLocation = localStorage.getItem(this.storageKey);
		if (storedLocation) {
			return JSON.parse(storedLocation);
		}
		return null;
	}
}
