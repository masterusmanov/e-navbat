import { Module } from '@nestjs/common';
import { SpecServiceService } from './spec_service.service';
import { SpecServiceController } from './spec_service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecService, SpecServiceSchema } from './schema/spec_service.schema';


@Module({
  imports: [MongooseModule.forFeature([{name: SpecService.name, schema: SpecServiceSchema}])],
  controllers: [SpecServiceController],
  providers: [SpecServiceService],
  exports: [SpecServiceService]
})
export class SpecServiceModule {}
