import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards
} from '@nestjs/common';
import { ExistingUserDTO } from 'src/user/DTOs/existing-user.dto';
import { NewUserDTO } from 'src/user/DTOs/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	async register(
		@Body() user: Readonly<NewUserDTO>
	): Promise<UserDetails | null | string> {
		return this.authService.register(user);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() user: Readonly<ExistingUserDTO>
	): Promise<{ token: string } | string> {
		return this.authService.login(user);
	}

	@Post('logout')
	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.OK)
	async logout(): Promise<string> {
		return 'Logged out successfully';
	}
}
