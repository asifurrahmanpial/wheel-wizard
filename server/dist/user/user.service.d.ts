import { Model } from 'mongoose';
import { UserDetails } from './user-details.interface';
import { UserDocument } from './user.schema';
import { ProfileService } from '../profile/profile.service';
export declare class UserService {
    private readonly userModel;
    private readonly profileService;
    constructor(userModel: Model<UserDocument>, profileService: ProfileService);
    _getUserDetails(user: UserDocument): UserDetails;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDetails | null>;
    create(name: string, email: string, hashedPassword: string): Promise<UserDocument>;
}
