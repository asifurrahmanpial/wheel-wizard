import { UserService } from './user.service';
import { UserDetails } from './user-details.interface';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(id: string): Promise<UserDetails | null>;
}
