import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { Document, HydratedDocument, Model } from 'mongoose';
import { v4 } from 'uuid';
import { CreateNotRecoveredPasswordDto } from './dto';
import { NotRecoveredPasswordsQueryRepository } from './not-recovered-passwords.query-repository';
import { NotRecoveredPasswordsRepository } from './not-recovered-passwords.repository';

export type NotRecoveredPasswordDocument =
  HydratedDocument<NotRecoveredPassword>;

type NotRecoveredPasswordStaticType = {
  createInstance: (
    NotRecoveredPasswordModel: Model<NotRecoveredPasswordDocument>,
    notRecoveredPasswordDto: CreateNotRecoveredPasswordDto,
  ) => NotRecoveredPasswordDocument;
};

export type NotRecoveredPasswordModelType =
  Model<NotRecoveredPasswordDocument> & NotRecoveredPasswordStaticType;

@Schema()
export class NotRecoveredPassword extends Document {
  @Prop({ required: true }) email: string;

  @Prop({ required: true }) recoveryCode: string;

  @Prop({ required: true }) expiryDate: Date;

  static createInstance(
    NotRecoveredPasswordModel: Model<NotRecoveredPasswordDocument>,
    { email }: CreateNotRecoveredPasswordDto,
  ): NotRecoveredPasswordDocument {
    return new NotRecoveredPasswordModel({
      email,
      recoveryCode: v4(),
      expiryDate: add(new Date(), { minutes: 5 }),
    });
  }

  checkConfirmation(recoveryCode: string): boolean {
    return this.recoveryCode === recoveryCode && this.expiryDate > new Date();
  }

  async updateConfirmation(
    notRecoveredPasswordsRepository: NotRecoveredPasswordsRepository,
    notRecoveredPasswordsQueryRepository: NotRecoveredPasswordsQueryRepository,
  ): Promise<NotRecoveredPasswordDocument | null> {
    const notRecoveredPassword =
      await notRecoveredPasswordsQueryRepository.getNotRecoveredPasswordByEmail(
        this.email,
      );

    if (!notRecoveredPassword) {
      return null;
    }

    notRecoveredPassword.recoveryCode = v4();
    notRecoveredPassword.expiryDate = add(new Date(), { minutes: 5 });

    return notRecoveredPasswordsRepository.save(notRecoveredPassword);
  }
}

export const NotRecoveredPasswordSchema =
  SchemaFactory.createForClass(NotRecoveredPassword);

NotRecoveredPasswordSchema.statics = {
  createInstance: NotRecoveredPassword.createInstance,
};

NotRecoveredPasswordSchema.methods = {
  checkConfirmation: NotRecoveredPassword.prototype.checkConfirmation,
  updateConfirmation: NotRecoveredPassword.prototype.updateConfirmation,
};
