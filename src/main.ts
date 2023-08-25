import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { resolve, join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as session from 'express-session';

import { ResponseInterceptor } from '@common';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: true });
  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  hbs.registerPartials(resolve('./src/views/layouts'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', '/src/views/layouts'));
  app.setViewEngine('hbs');
  app.use(
    session({
      secret: 'nest-book',
      resave: false,
      saveUninitialized: false,
    }),
  );

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
