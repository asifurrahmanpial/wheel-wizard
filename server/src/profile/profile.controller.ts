import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDocument } from './profile.schema';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':userId')
	getProfile(@Param('userId') userId: string): Promise<ProfileDocument | null> {
		return this.profileService.findByUserId(userId);
	}

	@Post()
	createProfile(
		@Body() profileData: Partial<ProfileDocument>
	): Promise<ProfileDocument> {
		return this.profileService.createProfile(
			profileData.userId,
			profileData.username,
			profileData.userEmail
		);
	}
}
