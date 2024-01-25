import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model } from 'mongoose';
import { CreateExpiredTokenDto } from './dto';

export type ExpiredTokenDocument = HydratedDocument<ExpiredToken>;

type ExpiredTokenStaticType = {
  createInstance: (
    ExpiredTokenModel: Model<ExpiredTokenDocument>,
    expiredTokenDto: CreateExpiredTokenDto,
  ) => ExpiredTokenDocument;
};

export type ExpiredTokenModelType = Model<ExpiredTokenDocument> &
  ExpiredTokenStaticType;

@Schema()
export class ExpiredToken extends Document {
  @Prop({ required: true }) token: string;

  static createInstance(
    ExpiredTokenModel: Model<ExpiredTokenDocument>,
    { token }: CreateExpiredTokenDto,
  ): ExpiredTokenDocument {
    return new ExpiredTokenModel({
      token,
    });
  }
}

export const ExpiredTokenSchema = SchemaFactory.createForClass(ExpiredToken);

ExpiredTokenSchema.statics = {
  createInstance: ExpiredToken.createInstance,
};
