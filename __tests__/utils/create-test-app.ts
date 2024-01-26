import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/utils';

export const createTestApp = async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = module.createNestApplication();

  appSettings(app);

  await app.init();

  return app;
};
