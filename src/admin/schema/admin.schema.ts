import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop({required: true})
  adminName: string;

  @Prop({required: true})
  adminPhoneNumber: string;

  @Prop({required: true})
  adminPassword: string;

  @Prop({default: true})
  is_active: boolean;

  @Prop({default: false})
  is_creator: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);