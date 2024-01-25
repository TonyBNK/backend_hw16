import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model } from 'mongoose';
import { CreateSecurityDeviceDto } from './dto';

export type SecurityDeviceDocument = HydratedDocument<SecurityDevice>;

type SecurityDeviceStaticType = {
  createInstance: (
    SecurityDeviceModel: Model<SecurityDeviceDocument>,
    securityDeviceDto: CreateSecurityDeviceDto,
  ) => SecurityDeviceDocument;
};

export type SecurityDeviceModelType = Model<SecurityDeviceDocument> &
  SecurityDeviceStaticType;

@Schema()
export class SecurityDevice extends Document {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) ip: string;
  @Prop() issueDate: string;

  static createInstance(
    SecurityDeviceModel: Model<SecurityDeviceDocument>,
    securityDeviceDto: CreateSecurityDeviceDto,
  ): SecurityDeviceDocument {
    return new SecurityDeviceModel(securityDeviceDto);
  }
}

export const SecurityDeviceSchema =
  SchemaFactory.createForClass(SecurityDevice);

SecurityDeviceSchema.statics = {
  createInstance: SecurityDevice.createInstance,
};
