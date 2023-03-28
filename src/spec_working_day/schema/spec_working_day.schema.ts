import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SpecWorkingDayDocument = HydratedDocument<SpecWorkingDay>;

@Schema({timestamps: true, collection: 'spec-working-day'})
export class SpecWorkingDay {
  
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Specialist'})
  specialistId: string;

  @Prop()
  dayOfWeek: string;

  @Prop()
  startTime: string;

  @Prop()
  finishTime: string;

  @Prop()
  restStartTime: string;

  @Prop()
  restFinishTime: string;
}

export const SpecWorkingDaySchema = SchemaFactory.createForClass(SpecWorkingDay);