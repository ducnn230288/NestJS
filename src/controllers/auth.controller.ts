import { Body, Get, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import * as fs from 'fs';

import {
  Auth,
  AuthUser,
  Headers,
  MaxGroup,
  OnlyUpdateGroup,
  Public,
  RefreshTokenGuard,
  ResetPasswordTokenGuard,
  SerializerBody,
  SharpPipe,
} from '@common';
import {
  DefaultResponsesDto,
  DefaultAuthResponseDto,
  ForgottenPasswordAuthRequestDto,
  LoginAuthRequestDto,
  ProfileAuthRequestDto,
  ProfileAuthResponseDto,
  RegisterAuthRequestDto,
  RestPasswordAuthRequestDto,
  UserResponseDto,
  AuthDto,
  DefaultAuthResponsesUserDto,
  ContactRequestDto,
} from '@dtos';
import { User } from '@entities';
import { AuthService, P_AUTH_DELETE_IMAGE_TEMP } from '@services';

@Headers('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public({
    summary: 'Login',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Post('login')
  async login(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([MaxGroup, OnlyUpdateGroup])) loginAuthDto: LoginAuthRequestDto,
  ): Promise<DefaultAuthResponseDto> {
    const user = await this.authService.login(loginAuthDto, i18n);
    const tokens = await this.authService.getTokens(user, true, i18n);
    return {
      message: i18n.t('common.Success'),
      data: {
        user: user,
        ...tokens,
      },
    };
  }

  @Public({
    summary: 'Forgotten password',
  })
  @Post('forgotten-password')
  async forgottenPassword(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody()) body: ForgottenPasswordAuthRequestDto,
  ): Promise<DefaultResponsesDto> {
    await this.authService.forgottenPassword(body, i18n);
    return {
      message: i18n.t('common.Success'),
    };
  }
 
  @Public({
    summary: 'Send email Contact',
  })
  @Post('send-email-contact')
  async sendEmailContact(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([MaxGroup])) body: ContactRequestDto,
  ): Promise<DefaultResponsesDto> {
    await this.authService.sendMailContact(body);
    return {
      message: i18n.t('common.Success'),
    };
  }

  @Auth({
    summary: 'Reset password',
    serializeOptions: { groups: [OnlyUpdateGroup] },
    tokenGuard: ResetPasswordTokenGuard,
  })
  @Post('reset-password')
  async resetPassword(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([OnlyUpdateGroup])) body: RestPasswordAuthRequestDto,
    @AuthUser() user: User,
  ): Promise<DefaultResponsesDto> {
    await this.authService.resetPassword(body, user, i18n);
    return {
      message: i18n.t('common.Success'),
    };
  }

  @Public({
    summary: 'Register',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Post('register')
  async register(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([MaxGroup, OnlyUpdateGroup])) createUserDto: RegisterAuthRequestDto,
  ): Promise<ProfileAuthResponseDto> {
    return {
      message: i18n.t('common.Success'),
      data: await this.authService.register(createUserDto, i18n),
    };
  }

  @Get('profile')
  @Auth({
    summary: 'My Profile',
    serializeOptions: { groups: [MaxGroup] },
  })
  async getProfile(@I18n() i18n: I18nContext, @AuthUser() user: User): Promise<UserResponseDto> {
    return {
      message: i18n.t('common.Success'),
      data: user,
    };
  }

  @Put('profile')
  @Auth({
    summary: 'Update my Profile',
    serializeOptions: { groups: [MaxGroup] },
  })
  async updateProfile(
    @I18n() i18n: I18nContext,
    @AuthUser() user: User,
    @Body(new SerializerBody([MaxGroup, OnlyUpdateGroup])) updateData: ProfileAuthRequestDto,
  ): Promise<UserResponseDto> {
    if (!updateData.password) {
      delete updateData.password;
    }
    return {
      message: i18n.t('common.Success'),
      data: await this.authService.update(user.id, updateData, i18n),
    };
  }

  @Get('refresh')
  @Auth({
    summary: 'Refresh Token',
    tokenGuard: RefreshTokenGuard,
  })
  async refreshTokens(@I18n() i18n: I18nContext, @AuthUser() user: User): Promise<DefaultAuthResponseDto> {
    return {
      message: i18n.t('common.Success'),
      data: (await this.authService.getTokens(user, false, i18n)) as AuthDto,
    };
  }

  @Get('logout')
  @Auth({
    summary: 'Logout',
  })
  async logout(@I18n() i18n: I18nContext, @AuthUser() user: User): Promise<UserResponseDto> {
    await this.authService.logout(user, i18n);
    return {
      message: i18n.t('common.Success'),
      data: null,
    };
  }

  @Post('upload')
  @Auth({
    summary: 'Upload',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@I18n() i18n: I18nContext, @UploadedFile(SharpPipe) data: { name: string; url: string }) {
    return {
      message: i18n.t('common.Success'),
      data,
    };
  }

  @Post('check-delete-file')
  @Auth({
    summary: 'Check delete file',
    permission: P_AUTH_DELETE_IMAGE_TEMP,
  })
  async checkDeleteFile(@I18n() i18n: I18nContext): Promise<ProfileAuthResponseDto> {
    if (process.env.AWS_ACCESS_KEY_ID) {
      const data = await this.authService.getListS3();
      data.Contents.forEach(async (file) => await this.authService.checkDeleteFile(file.Key));
    } else {
      fs.readdir('./uploads', async (err, files) => {
        // for (const file of files) {
        //   !(await this.authService.checkDeleteFile(file)) && fs.unlinkSync('./uploads/' + file);
        // }
      });
    }
    return {
      message: i18n.t('common.Success'),
      data: null,
    };
  }
}
