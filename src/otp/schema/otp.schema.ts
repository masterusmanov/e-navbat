import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true, collection: 'otps' })
export class Otp {
  
  @Prop()
  otp: string;

  @Prop()
  expirationTime: Date;
  
  @Prop({default: false})
  verified: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);