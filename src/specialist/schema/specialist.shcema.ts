import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SpecialistDocument = HydratedDocument<Specialist>;

@Schema()
export class Specialist {
  
    @Prop()
    specPosition: string;

    @Prop()
    specLastName: string;

    @Prop()
    specFirstName: string;

    @Prop()
    specMiddleName: string;

    @Prop()
    specBirthDay: Date;

    @Prop({required: true})
    specPhoneNumber: string;

    @Prop()
    specInfo: string;

    @Prop({default: true})
    specIsActive: boolean;

    @Prop({default: true})
    showPosition: boolean;

    @Prop({default: true})
    showLastName: boolean;

    @Prop({default: true})
    showFirstName: boolean;

    @Prop({default: true})
    showMiddleName: boolean;

    @Prop({default: true})
    showPhoto: boolean;

    @Prop({default: true})
    showSocial: boolean;

    @Prop({default: true})
    showInfo: boolean;

    @Prop({default: true})
    showBirthDay: boolean;

    @Prop({default: true})
    showPhoneNumber: boolean;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Otp'})
    otpId: string;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId, ref: 'SpecService'}], default: []},)
    services: String[];

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId, ref: 'SpecWorkingDay'}], default: []},)
    working_day: String[];
}

export const SpecialistSchema = SchemaFactory.createForClass(Specialist);