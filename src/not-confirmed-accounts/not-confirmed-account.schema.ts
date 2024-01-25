import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { Document, HydratedDocument, Model } from 'mongoose';
import { v4 } from 'uuid';
import { CreateNotConfirmedAccountDto } from './dto';
import { NotConfirmedAccountsQueryRepository } from './not-confirmed-accounts.query-repository';
import { NotConfirmedAccountsRepository } from './not-confirmed-accounts.repository';

export type NotConfirmedAccountDocument = HydratedDocument<NotConfirmedAccount>;

type NotConfirmedAccountStaticType = {
  createInstance: (
    NotConfirmedAccountModel: Model<NotConfirmedAccountDocument>,
    notConfirmedAccountDto: CreateNotConfirmedAccountDto,
  ) => NotConfirmedAccountDocument;
};

export type NotConfirmedAccountModelType = Model<NotConfirmedAccountDocument> &
  NotConfirmedAccountStaticType;

@Schema()
export class NotConfirmedAccount extends Document {
  @Prop({ required: true }) email: string;

  @Prop({ required: true }) confirmationCode: string;

  @Prop({ required: true }) expiryDate: Date;

  static createInstance(
    NotConfirmedAccountModel: Model<NotConfirmedAccountDocument>,
    { email }: CreateNotConfirmedAccountDto,
  ): NotConfirmedAccountDocument {
    return new NotConfirmedAccountModel({
      email,
      confirmationCode: v4(),
      expiryDate: add(new Date(), { minutes: 5 }),
    });
  }

  checkConfirmation(confirmationCode: string): boolean {
    return (
      this.confirmationCode === confirmationCode && this.expiryDate > new Date()
    );
  }

  async updateConfirmation(
    notConfirmedAccountsRepository: NotConfirmedAccountsRepository,
    notConfirmedAccountsQueryRepository: NotConfirmedAccountsQueryRepository,
  ): Promise<Promise<NotConfirmedAccountDocument | null>> {
    const notConfirmedAccount =
      await notConfirmedAccountsQueryRepository.getNotConfirmedAccountByEmail(
        this.email,
      );

    if (!notConfirmedAccount) {
      return null;
    }

    notConfirmedAccount.confirmationCode = v4();
    notConfirmedAccount.expiryDate = add(new Date(), { minutes: 5 });

    return notConfirmedAccountsRepository.save(notConfirmedAccount);
  }
}

export const NotConfirmedAccountSchema =
  SchemaFactory.createForClass(NotConfirmedAccount);

NotConfirmedAccountSchema.statics = {
  createInstance: NotConfirmedAccount.createInstance,
};

NotConfirmedAccountSchema.methods = {
  checkConfirmation: NotConfirmedAccount.prototype.checkConfirmation,
  updateConfirmation: NotConfirmedAccount.prototype.updateConfirmation,
};
