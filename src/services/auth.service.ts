import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { S3 } from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

import {
  ContactRequestDto,
  ForgottenPasswordAuthRequestDto,
  LoginAuthRequestDto,
  RegisterAuthRequestDto,
  RestPasswordAuthRequestDto,
  VerifyOtpDto,
} from '@dtos';
import { BaseService } from '@common';
import { Data, User } from '@entities';
import { MailService } from './mail.service';

export const P_AUTH_DELETE_IMAGE_TEMP = '11cc566b-b109-49f8-983f-84ff08f9849e';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(Data) public repoData: Repository<Data>,
    private mailService: MailService,
  ) {
    super(repo);
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.repo.update(userId, {
      refreshToken: await argon2.hash(refreshToken),
    });
  }

  async getTokens(user: User, returnRefresh = true) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: user.id,
          email: user.email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        },
      ),
      returnRefresh
        ? this.jwtService.signAsync(
          {
            userId: user.id,
            email: user.email,
          },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '1d',
          },
        )
        : null,
    ]);
    if (returnRefresh) {
      await this.updateRefreshToken(user.id, refreshToken);
    }
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(user: User) {
    return await this.repo.update(user.id, { refreshToken: null });
  }

  async forgottenPassword(body: ForgottenPasswordAuthRequestDto, i18n: I18nContext) {
    const user = await this.repo
      .createQueryBuilder('base')
      .andWhere(`base.email=:email`, { email: body.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(i18n.t('common.Auth.Invalid email'));
    }
    user.resetPasswordToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        email: user.email,
      },
      {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    );

    user.otpCode = this.createOTP();
    user.otpExpire = new Date(Date.now() + 300 * 1000);


    await this.update(user.id, user, i18n);
    await this.mailService.sendUserConfirmation(user, user.resetPasswordToken, user.otpCode);
    return true;
  }

  async sendMailContact(body: ContactRequestDto) {
    await this.mailService.sendUserContact(body);
    return true;
  }

  async resetPassword(body: RestPasswordAuthRequestDto, i18n: I18nContext) {
    const user = await this.repo.createQueryBuilder('base').andWhere(`base.otpCode=:otpCode`, { otpCode: body.otpCode }).getOne();

    if (!user) {
      throw new UnauthorizedException(i18n.t('common.Auth.Invalid OTP'));
    }

    if (user.otpExpire && user.otpExpire < new Date()) {
      throw new BadRequestException(i18n.t('common.Auth.Otp expired'));
    }
    if (body.password !== body.retypedPassword) {
      throw new UnauthorizedException(i18n.t('common.Auth.Password do not match'));
    }
    await this.update(user.id, { password: body.password, resetPasswordToken: null, otpCode: null }, i18n);

    return true;
  }

  async login(loginAuthDto: LoginAuthRequestDto, i18n: I18nContext) {
    const user = await this.repo
      .createQueryBuilder('base')
      .andWhere(`base.email=:email`, { email: loginAuthDto.email })
      .leftJoinAndSelect('base.role', 'role')
      .leftJoinAndSelect('base.position', 'position')
      .getOne();

    if (!user) {
      throw new UnauthorizedException(i18n.t('common.Auth.User not found', { args: { email: loginAuthDto.email } }));
    }

    if (!(await argon2.verify(user.password, loginAuthDto.password))) {
      throw new UnauthorizedException(
        i18n.t('common.Auth.Invalid credentials for user', { args: { email: loginAuthDto.email } }),
      );
    }
    return user;
  }

  async register(createUserDto: RegisterAuthRequestDto, i18n: I18nContext) {
    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(i18n.t('common.Auth.Passwords are not identical'));
    }

    const existingUser = await this.repo
      .createQueryBuilder('base')
      .andWhere(`base.email=:email`, { email: createUserDto.email })
      .getOne();

    if (existingUser) {
      throw new BadRequestException(i18n.t('common.Auth.Email is already taken'));
    }
    const user = this.repo.create(createUserDto);
    const data = await this.repo.save(user);
    // await this.mailService.sendUserConfirmation(user, 'token');
    return data;
  }

  async getListS3(): Promise<any> {
    return new Promise((resolve, reject) => {
      new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }).listObjectsV2(
        {
          Bucket: process.env.AWS_ACCESS_BUCKET_NAME,
          Delimiter: '/',
          Prefix: 'avata-dev/',
        },
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err.message);
          }
          resolve(data);
        },
      );
    });
  }
  async checkDeleteFile(fileName: string) {
    let data = await this.repo
      .createQueryBuilder('base')
      .andWhere(`base.avatar like :avatar`, { avatar: '%' + fileName })
      .getCount();

    if (!data) {
      data = await this.repoData
        .createQueryBuilder('base')
        .andWhere(`base.image like :image`, { image: '%' + fileName })
        .getCount();
    }
    // if (!data) {
    //   const dataTemp = await this.repoPost.find({});
    //   dataTemp.forEach((item: Page) => {
    //     item.content.forEach((subItem: any) => {
    //       if (!data && subItem.image && subItem.image.indexOf(fileName) === (process.env.DOMAIN + 'files/').length) {
    //         data = 1;
    //       }
    //       if (!data && subItem?.content?.blocks?.length > 0) {
    //         subItem?.content?.blocks.forEach((block: any) => {
    //           if (!data && block?.data?.file?.url.indexOf(fileName) === (process.env.DOMAIN + 'files/').length) {
    //             data = 1;
    //           }
    //         });
    //       }
    //     });
    //   });
    // }
    if (!data && process.env.AWS_ACCESS_KEY_ID) {
      new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }).deleteObject(
        {
          Bucket: process.env.AWS_ACCESS_BUCKET_NAME,
          Key: fileName,
        },
        (err, data) => {
          if (err) {
            console.log(err);
          }
          console.log(data);
        },
      );
    }
    return data;
  }

  async verifyOTP(body: VerifyOtpDto, i18n: I18nContext) {
    const user = await this.repo.createQueryBuilder('base').andWhere(`base.otpCode=:otpCode`, { otpCode: body.otpCode }).getOne();
    if (!user) {
      throw new UnauthorizedException(i18n.t('common.Auth.Invalid Otp'));
    }
    if (user.otpExpire && user.otpExpire < new Date()) {
      throw new BadRequestException(i18n.t('common.Auth.Otp expired'));
    }
    return user;
  }

  createOTP(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
