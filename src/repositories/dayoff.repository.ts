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

  /**
   *
   * @param staffId
   * @returns number
   *
   */
  async getCountWaitByStaffId(staffId: string): Promise<number> {
    return await this.createQueryBuilder('base')
      .where(`base.status = :status`, { status: 0 })
      .andWhere(`base.staffId = :staffId`, { staffId })
      .getCount();
  }

  /**
   *
   * @param managerId
   * @returns number
   *
   */
  async getCountWaitByManagerId(managerId: string): Promise<number> {
    return await this.createQueryBuilder('base')
      .where(`base.status = :status`, { status: 0 })
      .andWhere(`base.managerId = :managerId`, { managerId })
      .getCount();
  }

  /**
   *
   * @param staffId
   * @returns DayOff[]
   *
   */
  async getManyDayOffThisYearByStaffId(staffId: string): Promise<DayOff[]> {
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

  /**
   *
   * @param staffId
   * @param dateLeaveStart
   * @param dateLeaveEnd
   * @returns number
   *
   */
  async getCountWaitByDateLeaveAndStaffId(staffId: string, dateLeaveStart: Date, dateLeaveEnd: Date): Promise<number> {
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

  /**
   *
   * @param staffId
   * @param dateLeaveStart
   * @param dateLeaveEnd
   * @returns DayOff[]
   *
   */
  async getManyWaitByDateLeaveAndStaffId(staffId: string, dateLeaveStart: Date, dateLeaveEnd: Date): Promise<DayOff[]> {
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

  /**
   *
   * @returns number
   *
   */
  async getCountToday(): Promise<number> {
    return await this.createQueryBuilder('base')
      .where(`"created_at" BETWEEN :startDate AND :endDate`, {
        startDate: dayjs().startOf('days').toDate(),
        endDate: dayjs().endOf('days').toDate(),
      })
      .getCount();
  }
}
