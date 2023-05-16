import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { resolve } from 'path';

import { ResponseInterceptor } from '@common';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: true });
  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('hbs');

  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.enableVersioning();
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    app.enableShutdownHooks();
  }
  if (process.env.ENABLE_DOCUMENTATION) {
    setupSwagger(app);
  }
  await app.listen(process.env.PORT || 3000);
  const logger = new Logger('___DevLog___');
  logger.log(`Server running on ${await app.getUrl()}`);

  return app;
}
bootstrap();
