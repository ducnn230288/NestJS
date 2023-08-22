import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { User } from '@entities';
import { ContactRequestDto } from '@dtos';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(user: User, token: string, otp: number) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <' + process.env.MAIL_FROM + '>',
      subject: 'Welcome to Ari! We got a request to Reset Password',
      template: './confirmation',
      context: {
        name: user.name,
        url: process.env.DOMAIN_FE + 'auth/reset-password?token=' + token,
        otp
      },
    });
  }

  async sendUserContact(context: ContactRequestDto) {
    await this.mailerService.sendMail({
      to: process.env.MAIL_FROM,
      from: '"ARI TECHNOLOGY" <' + process.env.MAIL_FROM + '>',
      subject: 'We got a request to Contact',
      template: './contact',
      context,
    });
  }
}
