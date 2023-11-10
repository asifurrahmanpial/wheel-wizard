import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileSchema } from './profile.schema';
import { ProfileService } from './profile.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }])
	],
	providers: [ProfileService],
	exports: [ProfileService],
	controllers: [ProfileController]
})
export class ProfileModule {}
