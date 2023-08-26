import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as dayjs from 'dayjs';

import { BaseService } from '@common';
import { CreateUserRequestDto } from '@dtos';
import { User } from '@entities';
import { UserRepository, DayoffRepository, UserTeamRepository } from '@repositories';

export const P_USER_LISTED = 'ac0c4f13-776d-4b71-be4d-f9952734a319';
export const P_USER_DETAIL = 'a9de3f3d-4c04-4f50-9d1b-c3c2e2eca6dc';
export const P_USER_CREATE = '41c9d4e1-ba5a-4850-ad52-35ac928a61d9';
export const P_USER_UPDATE = 'bc0b5f32-ddf7-4c61-b435-384fc5ac7574';
export const P_USER_DELETE = 'b82e6224-12c3-4e6c-b4e0-62495fb799bf';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    public readonly repo: UserRepository,
    public repoDayOff: DayoffRepository,
    public repoUserTeam: UserTeamRepository,
  ) {
    super(repo);
    this.listQuery = ['name', 'email', 'phoneNumber'];
    this.listJoin = ['teams', 'role', 'position', 'manager'];
  }

  async create(body: CreateUserRequestDto, i18n: I18nContext) {
    if (body.password !== body.retypedPassword)
      throw new BadRequestException(i18n.t('common.Auth.Passwords are not identical'));

    const existingUser = await this.repo.getDataByEmail(body.email);

    if (existingUser) throw new BadRequestException(i18n.t('common.Auth.Email is already taken'));
    body.dateLeave = this.getTotalDate(body.startDate);
    if (body.teamsId && body.teamsId.length > 0) {
      body.teams = await this.repoUserTeam.getManyByArrayId(body.teamsId);
    }

    return super.create(body, i18n);
  }

  async updateAllDaysOff(i18n: I18nContext) {
    const data = await this.repo.createQueryBuilder('base').getMany();
    data.forEach((item) => this.update(item.id, { ...item, dateLeave: item.dateLeave + 1 }, i18n));
    return null;
  }

  async update(id: string, body: any, i18n: I18nContext, callBack?: (data: Awaited<User>) => Awaited<User>) {
    if (body.managerId) {
      const user = await this.findOne(id, [], i18n);
      if (user.managerId && body.managerId != user.managerId) {
        const countDayOff = await this.repoDayOff.getCountWaitByStaffId(id);
        if (countDayOff > 0) {
          throw new BadRequestException(i18n.t('common.User.Other leave requests need approval'));
        }
      }
    }
    if (body.teamsId && body.teamsId.length > 0) {
      body.teams = await this.repoUserTeam.getManyByArrayId(body.teamsId);
    }
    return await super.update(id, body, i18n, (data) => {
      delete data.password;
      if (!!callBack) data = callBack(data);
      return data;
    });
  }

  getTotalDate(startDate: Date): number {
    const now = dayjs();
    const time = now.diff(now.startOf('year'), 'months');
    let dateLeave;
    if (now.month() > 2) {
      dateLeave = time;
    } else {
      if (dayjs(startDate).year() == now.year()) {
        dateLeave = dayjs(startDate).startOf('year').diff(startDate, 'months') + time;
      } else if (dayjs(startDate).year() == now.year() - 1) {
        dateLeave = now.diff(startDate, 'months');
      } else {
        dateLeave = 12 + time;
      }
    }
    return dateLeave;
  }

  async remove(id: string, i18n: I18nContext) {
    const user = await this.findOne(id, [], i18n);
    if (user.roleCode === 'manager') {
      const count = await this.repo.getCountByManagerId(user.id);
      if (count > 0) {
        throw new BadRequestException(i18n.t('common.User.Still managing other people'));
      }
    }
    if (user.managerId) {
      const countDayOff = await this.repoDayOff.getCountWaitByManagerId(user.managerId);
      if (countDayOff > 0) {
        throw new BadRequestException(i18n.t('common.User.Other leave requests need approval'));
      }
    }

    const res = await this.repo.softDelete(id);
    if (!res.affected) {
      throw new BadRequestException(id);
    }

    const teams = await this.repoUserTeam.getCountByManagerId(user.id);
    for (const item of teams) {
      item.managerId = null;
      await this.repoUserTeam.save(item);
    }

    return user;
  }
}
