import { Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecService, SpecServiceSchema } from '../spec_service/schema/spec_service.schema';
import { Specialist, SpecialistSchema } from './schema/specialist.shcema';
import { Otp, OtpSchema } from '../otp/schema/otp.schema';
import { Token, TokenSchema } from '../token/schema/token.schema';


@Module({
  imports: [MongooseModule.forFeature([{name: Specialist.name, schema: SpecialistSchema}, {name: Otp.name, schema: OtpSchema}, {name: Token.name, schema: TokenSchema}])], 
  controllers: [SpecialistController],
  providers: [SpecialistService],
  exports: [SpecialistService],
})
export class SpecialistModule {}
