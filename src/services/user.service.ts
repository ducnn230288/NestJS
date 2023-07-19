import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';
import * as dayjs from 'dayjs';

import { BaseService } from '@common';
import { CreateUserRequestDto } from '@dtos';
import { User } from '@entities';

export const P_USER_LISTED = 'ac0c4f13-776d-4b71-be4d-f9952734a319';
export const P_USER_DETAIL = 'a9de3f3d-4c04-4f50-9d1b-c3c2e2eca6dc';
export const P_USER_CREATE = '41c9d4e1-ba5a-4850-ad52-35ac928a61d9';
export const P_USER_UPDATE = 'bc0b5f32-ddf7-4c61-b435-384fc5ac7574';
export const P_USER_DELETE = 'b82e6224-12c3-4e6c-b4e0-62495fb799bf';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    public repo: Repository<User>,
  ) {
    super(repo);
    this.listQuery = ['name', 'email', 'phoneNumber'];
    this.listJoin = ['role', 'position'];
  }

  async create(body: CreateUserRequestDto, i18n: I18nContext) {
    if (body.password !== body.retypedPassword) {
      throw new BadRequestException(i18n.t('common.user.Passwords are not identical'));
    }

    const existingUser = await this.repo
      .createQueryBuilder('base')
      .andWhere(`base.email=:email`, { email: body.email })
      .getOne();

    if (existingUser) {
      throw new BadRequestException(i18n.t('common.user.Email is already taken'));
    }
    const user = this.repo.create(body);
    return await this.repo.save(user);
  }

  async update(id: string, body: any, i18n: I18nContext) {
    const data = await this.repo.preload({
      id,
      ...body,
    });
    if (!data) {
      throw new BadRequestException(i18n.t('common.user.Data id not found', { args: { id } }));
    }
    delete data.password;
    return this.repo.save(data);
  }

  async history(newData: User, status = 'UPDATED') {
    const originalID = newData.id;
    if (status === 'UPDATED') {
      const oldData = await this.repoHistory
        .createQueryBuilder('base')
        .where('base.originalID = :originalID', { originalID })
        .orderBy('base.createdAt', 'DESC')
        .getOne();
      if (oldData) {
        const keys: string[] = ['name', 'avatar', 'email', 'phoneNumber', 'description'];
        let checkDifferent = false;
        keys.forEach((key: string) => {
          if (!checkDifferent && newData[key]?.toString() != oldData[key]?.toString()) {
            checkDifferent = true;
          }
        });
        if (!checkDifferent) {
          const keysDate = ['dob'];
          keysDate.forEach((key: string) => {
            if (!checkDifferent && dayjs(oldData[key]).toISOString() != dayjs(newData[key]).toISOString()) {
              checkDifferent = true;
            }
          });
        }
        if (!checkDifferent) {
          return false;
        }
      }
    }

    delete newData.id;
    delete newData.createdAt;
    const data = this.repoHistory.create({ ...newData, originalID, action: status });
    await this.repoHistory.save(data);
  }
}
