// import { Component, NgZone, OnInit } from '@angular/core';
// import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
// import {
// 	Barcode,
// 	BarcodeFormat,
// 	BarcodeScanner,
// 	LensFacing
// } from '@capacitor-mlkit/barcode-scanning';

// import { AlertController } from '@ionic/angular';

// @Component({
// 	selector: 'app-qr-scanner',
// 	templateUrl: './qr-scanner.component.html',
// 	styleUrls: ['./qr-scanner.component.scss']
// })
// export class QrScannerComponent implements OnInit {
// 	public readonly barcodeFormat = BarcodeFormat;
// 	public readonly lensFacing = LensFacing;

// 	public formGroup = new UntypedFormGroup({
// 		formats: new UntypedFormControl([]),
// 		lensFacing: new UntypedFormControl(LensFacing.Back),
// 		googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
// 		googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0)
// 	});
// 	public barcodes: Barcode[] = [];
// 	public isSupported = false;
// 	public isPermissionGranted = false;

// 	constructor(private readonly ngZone: NgZone) {}
// 	public ngOnInit(): void {
// 		BarcodeScanner.isSupported().then((result) => {
// 			this.isSupported = result.supported;
// 		});
// 		BarcodeScanner.checkPermissions().then((result) => {
// 			this.isPermissionGranted = result.camera === 'granted';
// 		});
// 		BarcodeScanner.removeAllListeners().then(() => {
// 			BarcodeScanner.addListener(
// 				'googleBarcodeScannerModuleInstallProgress',
// 				(event) => {
// 					this.ngZone.run(() => {
// 						console.log('googleBarcodeScannerModuleInstallProgress', event);
// 						const { state, progress } = event;
// 						this.formGroup.patchValue({
// 							googleBarcodeScannerModuleInstallState: state,
// 							googleBarcodeScannerModuleInstallProgress: progress
// 						});
// 					});
// 				}
// 			);
// 		});
// 	}
// 	startScan = async () => {
// 		// The camera is visible behind the WebView, so that you can customize the UI in the WebView.
// 		// However, this means that you have to hide all elements that should not be visible.
// 		// You can find an example in our demo repository.
// 		// In this case we set a class `barcode-scanner-active`, which then contains certain CSS rules for our app.
// 		document.querySelector('body')?.classList.add('barcode-scanner-active');

// 		// Add the `barcodeScanned` listener
// 		const listener = await BarcodeScanner.addListener(
// 			'barcodeScanned',
// 			async (result) => {
// 				console.log(result.barcode);
// 			}
// 		);

// 		// Start the barcode scanner
// 		await BarcodeScanner.startScan();
// 	};

// 	stopScan = async () => {
// 		// Make all elements in the WebView visible again
// 		document.querySelector('body')?.classList.remove('barcode-scanner-active');

// 		// Remove all listeners
// 		await BarcodeScanner.removeAllListeners();

// 		// Stop the barcode scanner
// 		await BarcodeScanner.stopScan();
// 	};

// 	scanSingleBarcode = async () => {
// 		return new Promise(async (resolve) => {
// 			document.querySelector('body')?.classList.add('barcode-scanner-active');

// 			const listener = await BarcodeScanner.addListener(
// 				'barcodeScanned',
// 				async (result) => {
// 					await listener.remove();
// 					document
// 						.querySelector('body')
// 						?.classList.remove('barcode-scanner-active');
// 					await BarcodeScanner.stopScan();
// 					resolve(result.barcode);
// 				}
// 			);

// 			await BarcodeScanner.startScan();
// 		});
// 	};

// 	public async scan(): Promise<void> {
// 		const formats = this.formGroup.get('formats')?.value || [];
// 		const { barcodes } = await BarcodeScanner.scan({
// 			formats
// 		});
// 		this.barcodes = barcodes;
// 	}

// 	enableTorch = async () => {
// 		await BarcodeScanner.enableTorch();
// 	};

// 	disableTorch = async () => {
// 		await BarcodeScanner.disableTorch();
// 	};

// 	toggleTorch = async () => {
// 		await BarcodeScanner.toggleTorch();
// 	};

// 	isTorchEnabled = async () => {
// 		const { enabled } = await BarcodeScanner.isTorchEnabled();
// 		return enabled;
// 	};

// 	isTorchAvailable = async () => {
// 		const { available } = await BarcodeScanner.isTorchAvailable();
// 		return available;
// 	};

// 	openSettings = async () => {
// 		await BarcodeScanner.openSettings();
// 	};

// 	isGoogleBarcodeScannerModuleAvailable = async () => {
// 		const { available } =
// 			await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
// 		return available;
// 	};

// 	installGoogleBarcodeScannerModule = async () => {
// 		await BarcodeScanner.installGoogleBarcodeScannerModule();
// 	};

// 	checkPermissions = async () => {
// 		const { camera } = await BarcodeScanner.checkPermissions();
// 		return camera;
// 	};

// 	requestPermissions = async () => {
// 		const { camera } = await BarcodeScanner.requestPermissions();
// 		return camera;
// 	};
// }

import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
	Barcode,
	BarcodeFormat,
	BarcodeScanner,
	LensFacing
} from '@capacitor-mlkit/barcode-scanning';

@Component({
	selector: 'app-qr-scanner',
	templateUrl: './qr-scanner.component.html',
	styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit {
	public readonly barcodeFormat = BarcodeFormat;
	public readonly lensFacing = LensFacing;

	public formGroup = new UntypedFormGroup({
		formats: new UntypedFormControl([]),
		lensFacing: new UntypedFormControl(LensFacing.Back),
		googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
		googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0)
	});
	public barcodes: Barcode[] = [];
	public isSupported = false;
	public isPermissionGranted = false;

	constructor(
		private readonly ngZone: NgZone,
		private router: Router
	) {}

	public ngOnInit(): void {
		BarcodeScanner.isSupported().then((result) => {
			this.isSupported = result.supported;
		});
		BarcodeScanner.checkPermissions().then((result) => {
			this.isPermissionGranted = result.camera === 'granted';
		});
		BarcodeScanner.removeAllListeners().then(() => {
			BarcodeScanner.addListener(
				'googleBarcodeScannerModuleInstallProgress',
				(event) => {
					this.ngZone.run(() => {
						console.log('googleBarcodeScannerModuleInstallProgress', event);
						const { state, progress } = event;
						this.formGroup.patchValue({
							googleBarcodeScannerModuleInstallState: state,
							googleBarcodeScannerModuleInstallProgress: progress
						});
					});
				}
			);
		});
	}

	public async scan(): Promise<void> {
		const formats = this.formGroup.get('formats')?.value || [];
		const { barcodes } = await BarcodeScanner.scan({
			formats
		});
		this.barcodes = barcodes;

		// Process the scanned QR code data
		if (barcodes.length > 0) {
			const scannedQRCodeData = barcodes[0].rawValue;
			console.log('Scanned QR Code Data:', scannedQRCodeData);

			// Check if it's a valid URL and navigate to the extracted route
			const extractedRoute = this.extractRouteFromURL(scannedQRCodeData);
			if (extractedRoute) {
				this.router.navigate([extractedRoute]);
			}
		}
	}

	// Helper function to extract the route from a scanned URL
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
