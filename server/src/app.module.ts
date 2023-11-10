import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { ProfileModule } from './profile/profile.module';
import { RideModule } from './ride/ride.module';
import { UserModule } from './user/user.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true
		}),
		MongooseModule.forRoot(process.env.DB_URI),
		AuthModule,
		UserModule,
		RideModule,
		VehiclesModule,
		ProfileModule
	],
	controllers: [AppController, PaymentController],
	providers: [AppService, PaymentService]
})
export class AppModule implements OnModuleInit {
	async onModuleInit() {
		await this.bootstrap();
	}

	async bootstrap() {
		const app = await NestFactory.create(AppModule);

		const corsOptions: CorsOptions = {
			origin: '*', // Replace '*' with the desired origin or origins
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			preflightContinue: false,
			optionsSuccessStatus: 204,
			credentials: true,
			allowedHeaders: 'Content-Type, Accept, authorization'
		};
		app.enableCors(corsOptions);

		await app.listen(process.env.PORT || 3000);
	}
}
