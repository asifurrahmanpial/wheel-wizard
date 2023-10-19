import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';

@Module({
	imports: [
		UserModule,
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: 'secret',
				signOptions: { expiresIn: '1h' }
			})
		})
	],
	controllers: [AuthController],
	providers: [AuthService, JwtGuard, JwtStrategy]
})
export class AuthModule {}
