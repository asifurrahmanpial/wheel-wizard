import { Model } from 'mongoose';
import { ProfileDocument } from './profile.schema';
import { UpdateProfileDto } from './UpdateProfileDto';
export declare class ProfileService {
    private readonly profileModel;
    constructor(profileModel: Model<ProfileDocument>);
    createProfile(userId: string, username: string, userEmail: string): Promise<ProfileDocument>;
    updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<ProfileDocument>;
    findByUserId(userId: string): Promise<ProfileDocument | null>;
    getProfile(id: string): Promise<ProfileDocument>;
    getProfileByUserId(userId: string): Promise<ProfileDocument>;
}
