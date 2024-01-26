import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { appSettings } from './utils';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  appSettings(app);

  await app.listen(PORT);
}
bootstrap(); //
