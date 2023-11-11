import { JwtService } from '@nestjs/jwt';
import { ExistingUserDTO } from 'src/user/DTOs/existing-user.dto';
import { NewUserDTO } from 'src/user/DTOs/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    private invalidatedTokens;
    constructor(userService: UserService, jwtService: JwtService);
    hashPassword(password: string): Promise<string>;
    register(user: Readonly<NewUserDTO>): Promise<UserDetails | null | string>;
    doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
    validateUser(email: string, password: string): Promise<UserDetails | null>;
    login(existingUser: ExistingUserDTO): Promise<{
        token: string;
    } | string>;
    invalidateToken(token: string): Promise<void>;
    isTokenInvalid(token: string): Promise<boolean>;
}
