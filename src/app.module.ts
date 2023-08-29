import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { resolve } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { AccessTokenStrategy, AllExceptionFilter, RefreshTokenStrategy, ResetPasswordTokenStrategy } from '@common';
import {
  AppController,
  AuthController,
  CodeController,
  CodeTypeController,
  DataController,
  DataTypeController,
  ErrorController,
  ParameterController,
  PostController,
  PostTypeController,
  UserController,
  UserRoleController,
} from '@controllers';
import {
  Code,
  CodeType,
  Data,
  DataTranslation,
  DataType,
  Error,
  Parameter,
  Post,
  PostTranslation,
  PostType,
  User,
  UserRole,
} from '@entities';
import {
  CodeTypeRepository,
  DataRepository,
  ParameterRepository,
  PostRepository,
  PostTranslationRepository,
  UserRepository,
} from '@repositories';
import {
  AuthService,
  CodeService,
  CodeTypeService,
  DataService,
  DataTypeService,
  ErrorService,
  ParameterService,
  PostService,
  PostTypeService,
  MailService,
  UserRoleService,
  UserService,
} from '@services';

@Module({
  controllers: [
    AppController,
    AuthController,
    CodeController,
    CodeTypeController,
    DataController,
    DataTypeController,
    ErrorController,
    ParameterController,
    PostController,
    PostTypeController,
    UserController,
    UserRoleController,
  ],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ResetPasswordTokenStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: ErrorFilter,
    // },
    AuthService,
    MailService,
    CodeService,
    CodeTypeRepository,
    CodeTypeService,
    DataRepository,
    DataService,
    DataTypeService,
    ErrorService,
    ParameterRepository,
    ParameterService,
    PostRepository,
    PostService,
    PostTranslationRepository,
    PostTypeService,
    UserRepository,
    UserService,
    UserRoleService,
  ],
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    TypeOrmModule.forFeature([
      Code,
      CodeType,
      Data,
      DataTranslation,
      DataType,
      Error,
      Parameter,
      Post,
      PostTranslation,
      PostType,
      User,
      UserRole,
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_PUBLIC_KEY,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        },
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: resolve('./src/views/mail'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot(
      (() => {
        const publicDir = resolve('./uploads/');
        const servePath = '/files';
        return {
          rootPath: publicDir,
          serveRoot: servePath,
          exclude: ['/api*'],
        };
      })(),
    ),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'prod',
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: resolve('./src/translations'),
        watch: process.env.NODE_ENV !== 'production',
      },
      resolvers: [{ use: QueryResolver, options: ['Accept-Language'] }, AcceptLanguageResolver],
      viewEngine: 'hbs',
    }),
  ],
})
export class AppModule {}
