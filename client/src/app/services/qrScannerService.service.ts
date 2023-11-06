import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class QrScannerService {
	constructor(private router: Router) {}

	async scanQRCode(vehicleData: any): Promise<void> {
		const { barcodes } = await BarcodeScanner.scan({
			formats: []
		});

		if (barcodes.length > 0) {
			const scannedQRCodeData = barcodes[0].rawValue;
			console.log('Scanned QR Code Data:', scannedQRCodeData);
			console.log('Vehicle Data:', vehicleData);

			// Extract the route from the scanned QR code data
			const extractedRoute = this.extractRouteFromURL(scannedQRCodeData);

			if (extractedRoute) {
				// Navigate to the extracted route along with the vehicle data
				this.router.navigate([extractedRoute], { state: { vehicleData } });
			}
		}
	}

	private extractRouteFromURL(url: string): string | null {
		try {
			const urlObject = new URL(url);
			const path = urlObject.pathname;
			return path.startsWith('/') ? path : null; // Ensure it starts with '/'
		} catch (e) {
			return null;
		}
	}
}
