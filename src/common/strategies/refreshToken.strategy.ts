import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { User } from '@entities';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.userRepository
      .createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id: payload.userId })
      .andWhere(`base.email=:email`, { email: payload.email })
      .getOne();
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      req.get('Authorization').replace('Bearer', '').trim(),
    );
    if (!refreshTokenMatches) throw new UnauthorizedException();

    return user;
  }
}
