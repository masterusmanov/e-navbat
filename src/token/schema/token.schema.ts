import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  
  @Prop()
  tableName: string;

  @Prop()
  userId: string;

  @Prop()
  userOs: Date;

  @Prop()
  userDevice: string;

  @Prop()
  hashedRefreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);