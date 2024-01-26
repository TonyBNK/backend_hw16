import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const token = Buffer.from(
  `${process.env.SUPER_ADMIN_LOGIN}:${process.env.SUPER_ADMIN_PASSWORD}`,
).toString('base64');
const auth = `Basic ${token}`;

export const basicAuth = { Authorization: auth };
