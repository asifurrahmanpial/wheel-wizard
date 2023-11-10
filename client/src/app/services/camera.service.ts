import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})
export class CameraService {
	constructor(private sanitizer: DomSanitizer) {}

	async takePicture(): Promise<SafeUrl | null> {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			// source: CameraSource.Prompt,
			source: CameraSource.Camera,
			resultType: CameraResultType.Base64
		});

		if (image) {
			const base64Image = `data:image/jpeg;base64,${image.base64String}`;
			return this.sanitizer.bypassSecurityTrustUrl(base64Image);
		}

		return null;
	}
}
