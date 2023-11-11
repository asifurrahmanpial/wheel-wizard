import { ProfileService } from './profile.service';
import { ProfileDocument } from './profile.schema';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(userId: string): Promise<ProfileDocument | null>;
    createProfile(profileData: Partial<ProfileDocument>): Promise<ProfileDocument>;
}
