import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { Otp, OtpSchema } from './schema/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{name: Otp.name, schema: OtpSchema}])],

  controllers: [OtpController],
  providers: [OtpService]
})
export class OtpModule {}
