import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SpecServiceDocument = HydratedDocument<SpecService>;

@Schema()
export class SpecService {
  
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Specialist'})
  specId: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Service'})
  serviceId: string;

  @Prop()
  specServicePrice: number;

  @Prop({type:[{type:mongoose.Schema.Types.ObjectId, ref: 'Queue'}], default: []},)
  queues: String[];
}

export const SpecServiceSchema = SchemaFactory.createForClass(SpecService);