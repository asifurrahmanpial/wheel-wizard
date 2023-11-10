import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
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
bootstrap();
