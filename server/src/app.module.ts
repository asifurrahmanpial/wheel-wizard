import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RideModule } from './ride/ride.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';

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
		VehiclesModule
	],
	controllers: [AppController, PaymentController],
	providers: [AppService, PaymentService]
})
export class AppModule {}
