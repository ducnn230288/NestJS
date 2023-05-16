import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@entities';

@Injectable()
export class ResetPasswordTokenStrategy extends PassportStrategy(Strategy, 'jwt-reset-password') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_RESET_PASSWORD_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.userRepository
      .createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id: payload.userId })
      .andWhere(`base.email=:email`, { email: payload.email })
      .andWhere(`base.resetPasswordToken=:data`, { data: req.get('Authorization').replace('Bearer', '').trim() })
      .getOne();
    if (!user || !user.resetPasswordToken) throw new UnauthorizedException();

    return user;
  }
}
