import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { DayOff } from '@entities';
import { Brackets, DataSource } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class DayoffRepository extends BaseRepository<DayOff> {
  constructor(private readonly dataSource: DataSource) {
    super(DayOff, dataSource.createEntityManager());
  }

  async getCountWaitByStaffId(staffId: string) {
    return await this.createQueryBuilder('base')
      .where(`base.status = :status`, { status: 0 })
      .andWhere(`base.staffId = :staffId`, { staffId })
      .getCount();
  }

  async getCountWaitByManagerId(managerId: string) {
    return await this.createQueryBuilder('base')
      .where(`base.status = :status`, { status: 0 })
      .andWhere(`base.managerId = :managerId`, { managerId })
      .getCount();
  }

  async getManyDayOffThisYearByStaffId(staffId: string) {
    const now = dayjs();
    return await this.createQueryBuilder('base')
      .andWhere(`base.staffId=:staffId`, { staffId })
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
  }

  async getCountWaitByDateLeaveAndStaffId(staffId: string, dateLeaveStart: Date, dateLeaveEnd: Date) {
    return await this.createQueryBuilder('base')
      .orWhere(
        new Brackets((qb) => {
          qb.andWhere('base.staffId = :staffId', { staffId })
            .andWhere('base.type = :type', { type: 1 })
            .andWhere('base.status = :status', { status: 0 })
            .andWhere(`"dateLeaveStart" BETWEEN :startDate AND :endDate`, {
              startDate: dayjs(dateLeaveStart).startOf('days').toDate(),
              endDate: dayjs(dateLeaveEnd).endOf('days').toDate(),
            });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.andWhere('base.staffId = :staffId', { staffId })
            .andWhere('base.type = :type', { type: 1 })
            .andWhere('base.status = :status', { status: 0 })
            .andWhere(`"dateLeaveEnd" BETWEEN :startDate AND :endDate`, {
              startDate: dayjs(dateLeaveStart).startOf('days').toDate(),
              endDate: dayjs(dateLeaveEnd).endOf('days').toDate(),
            });
        }),
      )
      .getCount();
  }

  async getManyWaitByDateLeaveAndStaffId(staffId: string, dateLeaveStart: Date, dateLeaveEnd: Date) {
    return await this.createQueryBuilder('base')
      .orWhere(
        new Brackets((qb) => {
          qb.andWhere('base.staffId = :staffId', { staffId })
            .andWhere('base.type = :type', { type: 1 })
            .andWhere('base.status = :status', { status: 0 })
            .andWhere(`"dateLeaveStart" BETWEEN :startDate AND :endDate`, {
              startDate: dayjs(dateLeaveStart).subtract(30, 'days').startOf('days').toDate(),
              endDate: dayjs(dateLeaveEnd).endOf('days').toDate(),
            });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.andWhere('base.staffId = :staffId', { staffId })
            .andWhere('base.type = :type', { type: 1 })
            .andWhere('base.status = :status', { status: 0 })
            .andWhere(`"dateLeaveEnd" BETWEEN :startDate AND :endDate`, {
              startDate: dayjs(dateLeaveStart).startOf('days').toDate(),
              endDate: dayjs(dateLeaveEnd).add(30, 'days').endOf('days').toDate(),
            });
        }),
      )
      .getMany();
  }

  async getCountToday() {
    return await this.createQueryBuilder('base')
      .where(`"created_at" BETWEEN :startDate AND :endDate`, {
        startDate: dayjs().startOf('days').toDate(),
        endDate: dayjs().endOf('days').toDate(),
      })
      .getCount();
  }
}
