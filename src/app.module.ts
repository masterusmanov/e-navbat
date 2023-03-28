import { Module } from '@nestjs/common';
import { SpecWorkingDayModule } from './spec_working_day/spec_working_day.module';
import { AdminModule } from './admin/admin.module';
import { TokenModule } from './token/token.module';
import { SpecialistModule } from './specialist/specialist.module';
import { OtpModule } from './otp/otp.module';
import { SpecServiceModule } from './spec_service/spec_service.module';
import { ServiceModule } from './service/service.module';
import { QueueModule } from './queue/queue.module';
import { ClientModule } from './client/client.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    SpecWorkingDayModule,
    AdminModule,
    TokenModule,
    SpecialistModule,
    OtpModule,
    SpecServiceModule,
    ServiceModule,
    QueueModule,
    ClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
