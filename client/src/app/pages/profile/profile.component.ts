import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

interface Profile {
	totalTrips: number;
	totalFare: number;
	totalDuration: number;
	totalDistance: number;
	username: string;
	userEmail: string;
	userId: string;
}
@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	profile: Profile | null = null; // Declare the profile property

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
		this.authService.getProfile().subscribe(
			(profile: Profile | null) => {
				this.profile = profile; // Assign the profile data to the profile property
				console.log('Profile:', profile);

				// Update the current username in the AuthService
				if (profile) {
					this.authService.currentUsername.next(profile.username);
					console.log(
						'Total Duration:',
						this.calculateDuration(profile.totalDuration)
					);
				}
			},
			(error: any) => {
				console.error('Error:', error);
			}
		);
	}

	calculateDuration(duration: number | undefined): string {
		if (duration === undefined) {
			return '0 hr 0 min 0 sec';
		}
		const hours = Math.floor(duration / (1000 * 60 * 60));
		const minutes = Math.floor((duration / (1000 * 60)) % 60);
		const seconds = Math.floor((duration / 1000) % 60);

		return `${hours} hr ${minutes} min ${seconds} sec`;
	}
}
