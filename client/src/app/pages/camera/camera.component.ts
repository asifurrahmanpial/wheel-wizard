import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-camera',
	templateUrl: './camera.component.html',
	styleUrls: ['./camera.component.scss']
})
export class CameraComponent {
	image: SafeUrl | null = null;

	constructor(private sanitizer: DomSanitizer) {}

	takePicture = async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			source: CameraSource.Prompt,
			resultType: CameraResultType.Base64
		});

		if (image) {
			const base64Image = `data:image/jpeg;base64,${image.base64String}`;
			this.image = this.sanitizer.bypassSecurityTrustUrl(base64Image);
			console.log(image.base64String);
		}
	};
}
