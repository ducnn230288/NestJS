import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserRepository } from '@repositories';

@Injectable()
export class ResetPasswordTokenStrategy extends PassportStrategy(Strategy, 'jwt-reset-password') {
  constructor(private readonly repo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_RESET_PASSWORD_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.repo.getDataByResetPassword(
      payload.userId,
      payload.email,
      req.get('Authorization').replace('Bearer', '').trim(),
    );
    if (!user || !user.resetPasswordToken) throw new UnauthorizedException();

    return user;
  }
}
