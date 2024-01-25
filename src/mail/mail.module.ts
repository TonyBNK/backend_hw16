import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configSirvice: ConfigService) => ({
        transport: {
          service: 'Yandex',
          host: 'localhost',
          secure: false,
          auth: {
            user: configSirvice.get('EMAIL_ADDRESS'),
            pass: configSirvice.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configSirvice.get('EMAIL_ADDRESS')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
