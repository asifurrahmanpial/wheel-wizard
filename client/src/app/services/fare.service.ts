import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class FareService {
	private fare!: number;

	constructor() {}

	setFare(fare: number): void {
		this.fare = fare;
	}

	getFare(): number {
		return this.fare;
	}
}
