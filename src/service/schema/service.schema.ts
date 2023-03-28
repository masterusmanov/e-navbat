import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ServiceDocument = HydratedDocument<Service>;

@Schema()
export class Service {
  
  @Prop()
  serviceName: string;

  @Prop()
  servicePrice: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);