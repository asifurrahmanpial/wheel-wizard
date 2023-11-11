import { ExistingUserDTO } from 'src/user/DTOs/existing-user.dto';
import { NewUserDTO } from 'src/user/DTOs/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(user: Readonly<NewUserDTO>): Promise<UserDetails | null | string>;
    login(user: Readonly<ExistingUserDTO>): Promise<{
        token: string;
    } | string>;
    logout(): Promise<string>;
}
