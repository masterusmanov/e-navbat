import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  
  @Prop()
  clientLastName: string;

  @Prop()
  clientFirstName: string;

  @Prop({required: true})
  clientPhoneNumber: string;

  @Prop()
  clientInfo: string;

  @Prop()
  clientPhoto: string;

  @Prop({default: true})
  clientIsActive: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Otp'})
  otpId: string;

  @Prop({type:[{type:mongoose.Schema.Types.ObjectId, ref: 'Queue'}], default: []},)
  queues: String[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);