import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ExistingUserDTO } from 'src/user/DTOs/existing-user.dto';
import { NewUserDTO } from 'src/user/DTOs/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	private invalidatedTokens: Set<string> = new Set();

	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 12);
	}

	async register(
		user: Readonly<NewUserDTO>
	): Promise<UserDetails | null | string> {
		const { name, email, password } = user;
		const existingUser = await this.userService.findByEmail(email);

		if (existingUser) {
			return 'User already exists';
		}

		const hashedPassword = await this.hashPassword(password);
		const newUser = await this.userService.create(name, email, hashedPassword);

		return this.userService._getUserDetails(newUser);
	}

	async doesPasswordMatch(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}

	async validateUser(
		email: string,
		password: string
	): Promise<UserDetails | null> {
		const user = await this.userService.findByEmail(email);
		const doesUserExist = !!user;
		if (!doesUserExist) {
			return null;
		}
		const doesPasswordMatch = await this.doesPasswordMatch(
			password,
			user.password
		);
		if (!doesPasswordMatch) {
			return null;
		}
		return this.userService._getUserDetails(user);
	}

	async login(
		existingUser: ExistingUserDTO
	): Promise<{ token: string } | string> {
		const { email, password } = existingUser;
		const user = await this.validateUser(email, password);

		if (!user) {
			return "User doesn't exist";
		}

		// Include the user ID in the JWT token
		const payload = { sub: user._id };
		const token = await this.jwtService.signAsync(payload);

		return { token };
	}

	async invalidateToken(token: string): Promise<void> {
		this.invalidatedTokens.add(token);
	}

	async isTokenInvalid(token: string): Promise<boolean> {
		return this.invalidatedTokens.has(token);
	}
}
