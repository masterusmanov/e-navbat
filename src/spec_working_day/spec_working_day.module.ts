import { Module } from '@nestjs/common';
import { SpecWorkingDayService } from './spec_working_day.service';
import { SpecWorkingDayController } from './spec_working_day.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecWorkingDay, SpecWorkingDaySchema } from './schema/spec_working_day.schema';
import { Specialist, SpecialistSchema } from '../specialist/schema/specialist.shcema';

@Module({
  imports: [MongooseModule.forFeature([{name: SpecWorkingDay.name, schema: SpecWorkingDaySchema}, {name: Specialist.name, schema: SpecialistSchema}])],
  controllers: [SpecWorkingDayController],
  providers: [SpecWorkingDayService],
  exports: [SpecWorkingDayService]
})
export class SpecWorkingDayModule {}
