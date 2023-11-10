import { Module } from '@nestjs/common';
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
export class AppModule {}
