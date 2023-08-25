import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import * as argon2 from 'argon2';

import { UserRepository } from '@repositories';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly repo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.repo.getDataByIdAndEmail(payload.userId, payload.email);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      req.get('Authorization').replace('Bearer', '').trim(),
    );
    if (!refreshTokenMatches) throw new UnauthorizedException();

    return user;
  }
}
