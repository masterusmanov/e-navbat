import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QueueDocument = HydratedDocument<Queue>;

@Schema()
export class Queue {
  
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'SpecService'})
  specServiceId: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Client'})
  clientId: string;

  @Prop()
  QueueDateTime: Date;

  @Prop()
  queueNumber: number;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);