import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type EmailInfo = { email: string; subject: string; message: string };

const baseUrl = process.env.HOST_URL || 'http://localhost:3000';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendRegistrationConfirmationMessage(
    email: string,
    confirmationCode: string,
  ): Promise<boolean> {
    return this.sendMessage({
      email,
      subject: 'Jedi Registration',
      message: `<h1>Hello there!</h1>
 <p>To finish your registration follow the link below:
     <a href='${baseUrl}/auth/registration-confirmation?code=${confirmationCode}'>complete registration</a>
 </p>`,
    });
  }

  async sendPasswordRecoveryMessage(
    email: string,
    confirmationCode: string,
  ): Promise<boolean> {
    return this.sendMessage({
      email,
      subject: 'Jedi Password recovery',
      message: `<h1>Hello there!</h1>
 <p>To finish password recovery please follow the link below:
     <a href='${baseUrl}/auth/password-recovery?recoveryCode=${confirmationCode}'>recovery password</a>
 </p>`,
    });
  }

  private async sendMessage({
    email,
    subject,
    message,
  }: EmailInfo): Promise<boolean> {
    try {
      const info = await this.mailerService.sendMail({
        from: `"Obi Wan Kenobi 👻" <${this.configService.get('EMAIL_ADDRESS')}>`,
        to: email,
        subject,
        html: message,
      });

      return !!info.accepted.length;
    } catch (error) {
      throw new Error(error);
    }
  }
}
