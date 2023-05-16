import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '@entities';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: { userId: string; email: string }) {
    const user = await this.userRepository
      .createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id: payload.userId })
      .andWhere(`base.email=:email`, { email: payload.email })
      .leftJoinAndSelect('base.role', 'role')
      .getOne();
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
