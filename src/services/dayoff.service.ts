import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';
import * as dayjs from 'dayjs';

import { BaseService } from '@common';
import { CreateDayoffRequestDto, StatusDayoffRequestDto } from '@dtos';
import { DayOff, User } from '@entities';
import { UserService } from './user.service';

export const P_DAYOFF_LISTED = '80668128-7e1d-46ef-95d1-bb4cff742f61';
export const P_DAYOFF_DETAIL = 'bd11ca07-2cf4-473f-ac43-50b0eac577f3';
export const P_DAYOFF_CREATE = 'becacb61-46c5-445e-bce4-0f3a2cfed519';
export const P_DAYOFF_UPDATE = '972e4159-e3ce-416e-a526-ffd83039e09a';
export const P_DAYOFF_DELETE = 'cdece61b-f159-4dec-8b27-b7de50c9b849';
export const P_DAYOFF_UPDATE_STATUS = '3431f438-20fd-4482-b2e1-ad7f89c67eed';

@Injectable()
export class DayoffService extends BaseService {
  constructor(
    @InjectRepository(DayOff)
    public repo: Repository<DayOff>,
    // @InjectRepository(UserHistory)
    // public repoHistoryUser: Repository<UserHistory>,
    private readonly userService: UserService,
  ) {
    super(repo);
    this.listJoin = ['staff', 'manager', 'approvedBy'];
  }

  async updateStaff(user: User, i18n: I18nContext) {
    const now = dayjs();
    const data = await this.repo
      .createQueryBuilder('base')
      .andWhere(`base.staffId=:staffId`, { staffId: user.id })
      .andWhere(`base.type=:type`, { type: 1 })
      .andWhere(`base.status != :status`, { status: -1 })
      .andWhere(`"dateLeaveStart" BETWEEN :startDate AND :endDate`, {
        startDate: now.startOf('year').toDate(),
        endDate: now.endOf('year').toDate(),
      })
      .andWhere(`"dateLeaveEnd" BETWEEN :startDate AND :endDate`, {
        startDate: now.startOf('year').toDate(),
        endDate: now.endOf('year').toDate(),
      })
      .getMany();
    const dateOff = data.reduce((sum: number, item) => sum + item.timeNumber, 0);
    await this.userService.update(user.id, { dateOff, startDate: user.startDate }, i18n);
  }

  async checkHaveDate(user: User, body: CreateDayoffRequestDto, i18n: I18nContext) {
    const data = await this.repo
      .createQueryBuilder('base')
      .orWhere(
        new Brackets((qb) => {
          qb.andWhere('base.staffId = :staffId', { staffId: user.id })
            .andWhere('base.type = :type', { type: 1 })
            .andWhere('base.status = :status', { status: 0 })
            .andWhere(`"dateLeaveStart" BETWEEN :startDate AND :endDate`, {
              startDate: dayjs(body.dateLeaveStart).startOf('days').toDate(),
              endDate: dayjs(body.dateLeaveEnd).endOf('days').toDate(),
            });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.andWhere('base.staffId = :staffId', { staffId: user.id })
            .andWhere('base.type = :type', { type: 1 })
            .andWhere('base.status = :status', { status: 0 })
            .andWhere(`"dateLeaveEnd" BETWEEN :startDate AND :endDate`, {
              startDate: dayjs(body.dateLeaveStart).startOf('days').toDate(),
              endDate: dayjs(body.dateLeaveEnd).endOf('days').toDate(),
            });
        }),
      )
      .getCount();

    if (data > 0) {
      throw new BadRequestException(i18n.t('common.DayOff.The leave date has been registered'));
    } else {
      const listDay = await this.repo
        .createQueryBuilder('base')
        .orWhere(
          new Brackets((qb) => {
            qb.andWhere('base.staffId = :staffId', { staffId: user.id })
              .andWhere('base.type = :type', { type: 1 })
              .andWhere('base.status = :status', { status: 0 })
              .andWhere(`"dateLeaveStart" BETWEEN :startDate AND :endDate`, {
                startDate: dayjs(body.dateLeaveStart).subtract(30, 'days').startOf('days').toDate(),
                endDate: dayjs(body.dateLeaveEnd).endOf('days').toDate(),
              });
          }),
        )
        .orWhere(
          new Brackets((qb) => {
            qb.andWhere('base.staffId = :staffId', { staffId: user.id })
              .andWhere('base.type = :type', { type: 1 })
              .andWhere('base.status = :status', { status: 0 })
              .andWhere(`"dateLeaveEnd" BETWEEN :startDate AND :endDate`, {
                startDate: dayjs(body.dateLeaveStart).startOf('days').toDate(),
                endDate: dayjs(body.dateLeaveEnd).add(30, 'days').endOf('days').toDate(),
              });
          }),
        )
        .getMany();
      if (
        listDay.filter(
          (item) =>
            dayjs(item.dateLeaveStart).startOf('days') <= dayjs(body.dateLeaveStart) &&
            dayjs(item.dateLeaveEnd).startOf('days') >= dayjs(body.dateLeaveEnd).startOf('days'),
        ).length > 0
      ) {
        throw new BadRequestException(i18n.t('common.DayOff.The leave date has been registered'));
      }
    }
  }

  async createDayOff(body: CreateDayoffRequestDto, user: User, i18n: I18nContext) {
    await this.checkHaveDate(user, body, i18n);
    body.staffId = user.id;
    body.managerId = user.managerId;
    // body.staffHId = (
    //   await this.repoHistoryUser
    //     .createQueryBuilder('base')
    //     .where('base.originalID = :originalID', { originalID: user.id })
    //     .orderBy('base.createdAt', 'DESC')
    //     .getOne()
    // ).id;
    let number = 1;
    const dateLeaveStart = dayjs(body.dateLeaveStart);
    const dateLeaveEnd = dayjs(body.dateLeaveEnd);
    if (body.time === 0 && dateLeaveStart.endOf('week').toString() !== dateLeaveEnd.endOf('week').toString()) {
      number = -dayjs(body.dateLeaveEnd).endOf('week').diff(dayjs(body.dateLeaveStart).endOf('week'), 'weeks');
    }
    if (number < -1) {
      number = number - (number + 1) + (number + 1) * 2;
    }
    body.timeNumber = body.time === 0 ? dateLeaveEnd.diff(dateLeaveStart, 'days') + number : 0.5;
    const count = await this.repo
      .createQueryBuilder('base')
      .where(`"created_at" BETWEEN :startDate AND :endDate`, {
        startDate: dayjs().startOf('days').toDate(),
        endDate: dayjs().endOf('days').toDate(),
      })
      .getCount();
    body.code = (parseInt(dayjs().format('YYMMDD')) * 1000000 + (count + 1)).toString();

    const data = await super.create(body, i18n);
    await this.updateStaff(user, i18n);
    return data;
  }

  async updateStatus(id: string, body: StatusDayoffRequestDto, user: User, i18n: I18nContext) {
    const { managerId, staff } = await this.findOne(id);
    if (managerId !== user.id) {
      throw ForbiddenException;
    }
    // body.approvedByHId = (
    //   await this.repoHistoryUser
    //     .createQueryBuilder('base')
    //     .where('base.originalID = :originalID', { originalID: user.id })
    //     .orderBy('base.createdAt', 'DESC')
    //     .getOne()
    // ).id;
    const result = await this.update(id, { ...body, approvedById: user.id, approvedAt: new Date() }, i18n);
    if (body.status === -1) {
      await this.updateStaff(staff, i18n);
    }
    return result;
  }
}
