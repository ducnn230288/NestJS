import { Brackets, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as dayjs from 'dayjs';

import { PaginationQueryDto } from '@dtos';

export abstract class BaseService {
  public listQuery: string[] = [];
  public listJoin = [];
  public listJoinCount = [];
  public listHistoryKey = [];
  protected constructor(public repo: Repository<any>, public repoHistory?: Repository<any>) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { where, perPage, page, fullTextSearch } = paginationQuery;
    let { filter, sorts, extend, skip } = paginationQuery;

    if (typeof filter === 'string') filter = JSON.parse(filter);
    if (typeof sorts === 'string') sorts = JSON.parse(sorts);
    if (typeof extend === 'string') extend = JSON.parse(extend);
    if (typeof skip === 'string') skip = JSON.parse(skip);
    let request = this.repo
      .createQueryBuilder('base')
      .orderBy('base.createdAt', 'DESC')
      .withDeleted()
      .andWhere('base.isDeleted Is Null');
    if (this.listJoin.length) {
      this.listJoin.forEach((key) => {
        const checkKey = key.split('.');
        request.leftJoinAndSelect(`${checkKey.length === 1 ? 'base.' + checkKey[0] : key}`, key.replace('.', ''));
      });
    }

    if (where) {
      where.forEach((item) => {
        Object.keys(item).forEach((key) => {
          request = request.andWhere(`base.${key}=:${key}`, { [key]: item[key] });
        });
      });
    }
    if (filter && Object.keys(filter).length) {
      request = request.andWhere(
        new Brackets((qb) => {
          Object.keys(filter).forEach((key) => {
            if (typeof filter[key] === 'object' && filter[key]?.length > 0) {
              if (dayjs(filter[key][0]).isValid()) {
                qb = qb.andWhere(`"${key}" BETWEEN :startDate AND :endDate`, {
                  startDate: filter[key][0],
                  endDate: filter[key][1],
                });
              } else {
                const checkKey = key.split('.');
                qb = qb.andWhere(`${checkKey.length === 1 ? 'base.' + checkKey[0] : key} IN (:...${key})`, {
                  [key]: filter[key],
                });
              }
            } else if (typeof filter[key] !== 'object') {
              // /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(filter[key])
              qb = qb.andWhere(`base.${key}=:${key}`, { [key]: filter[key] });
            }
          });

          if (skip && Object.keys(skip).length) {
            Object.keys(skip).forEach((key) => {
              if (typeof skip[key] === 'object' && skip[key].length > 0) {
                if (dayjs(skip[key][0]).isValid()) {
                  qb = qb.andWhere(`"${key}" NOT BETWEEN :startDate AND :endDate`, {
                    startDate: skip[key][0],
                    endDate: skip[key][1],
                  });
                } else {
                  const checkKey = key.split('.');
                  qb = qb.andWhere(`${checkKey.length === 1 ? 'base.' + checkKey[0] : key} IN (:...${key})`, {
                    [key]: skip[key],
                  });
                }
              } else if (typeof skip[key] !== 'object') {
                // /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(skip[[key])
                qb = qb.andWhere(`base.${key}!=:${key}`, { [key]: skip[key] });
              }
            });
          }
        }),
      );
    }
    if (fullTextSearch && this.listQuery.length) {
      request = request.andWhere(
        new Brackets((qb) => {
          this.listQuery.forEach((key) => {
            if (!filter || !filter[key]) {
              qb = qb.orWhere(`base.${key} like :${key}`, {
                [key]: `%${fullTextSearch}%`,
              });
            }
          });
        }),
      );
    }

    if (this.listJoinCount.length) {
      this.listJoinCount.forEach((item) => {
        request = request.loadRelationCountAndMap('base.' + item.name, 'base.' + item.key);
      });
    }

    if (sorts && Object.keys(sorts).length) {
      Object.keys(sorts).forEach((key) => {
        request = request.orderBy('base.' + key, sorts[key]);
      });
    }
    if (perPage !== undefined && page !== undefined)
      request = request.take(perPage || 10).skip((page !== undefined ? page - 1 : 0) * (perPage || 10));
    const res: [any, number] = await request.getManyAndCount();
    if (extend && Object.keys(extend).length) {
      let isGet = false;
      const request = this.repo.createQueryBuilder('base').andWhere(
        new Brackets((qb) => {
          Object.keys(extend).forEach((key) => {
            if (typeof extend[key] === 'object' && extend[key].length > 0) {
              isGet = true;
              if (dayjs(extend[key][0]).isValid()) {
                qb = qb.andWhere(`"${key}" BETWEEN :startDate AND :endDate`, {
                  startDate: extend[key][0],
                  endDate: extend[key][1],
                });
              } else {
                const checkKey = key.split('.');
                qb = qb.andWhere(`${checkKey.length === 1 ? 'base.' + checkKey[0] : key} IN (:...${key})`, {
                  [key]: extend[key],
                });
              }
            } else if (typeof extend[key] !== 'object') {
              isGet = true;
              // /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(extend[key])
              qb = qb.andWhere(`base.${key}=:${key}`, { [key]: extend[key] });
            }
          });
        }),
      );
      if (isGet) {
        const data = await request.getMany();
        const ids = new Set(res[0].map((d) => d.id));
        res[0] = res[0].concat(data.filter((item) => !ids.has(item.id)));
      }
    }
    return [res[0], res[1]];
  }

  async findOne(id: string, listJoin: string[] = [], i18n: I18nContext) {
    const request = this.repo.createQueryBuilder('base').withDeleted().andWhere('base.isDeleted Is Null');
    if (this.listJoin.length) {
      this.listJoin.forEach((key) => {
        const checkKey = key.split('.');
        request.leftJoinAndSelect(`${checkKey.length === 1 ? 'base.' + checkKey[0] : key}`, key.replace('.', ''));
      });
    }
    if (listJoin.length) {
      listJoin.forEach((key) => {
        const checkKey = key.split('.');
        request.leftJoinAndSelect(`${checkKey.length === 1 ? 'base.' + checkKey[0] : key}`, key.replace('.', ''));
      });
    }
    const data = await request.where(`base.id=:id`, { id }).withDeleted().getOne();
    if (!data) {
      throw new BadRequestException(i18n.t('common.user.Data id not found', { args: { id } }));
    }
    return data;
  }

  async create(body: any, i18n: I18nContext) {
    const data = this.repo.create({ ...body });
    return this.repo.save(data);
  }

  async update(id: string, body: any, i18n: I18nContext) {
    const data = await this.repo.preload({
      id,
      ...body,
    });
    if (!data) {
      throw new BadRequestException(i18n.t('common.user.Data id not found', { args: { id } }));
    }
    return this.repo.save(data);
  }

  async remove(id: string, i18n: I18nContext) {
    const res = await this.repo.softDelete(id);
    if (!res.affected) {
      throw new BadRequestException(i18n.t('common.user.Data id not found', { args: { id } }));
    }
    return await this.findOne(id, [], i18n);
  }

  async removeHard(id: string, i18n: I18nContext) {
    const data = await this.findOne(id, [], i18n);
    const res = await this.repo.delete(id);
    if (!res.affected) {
      throw new BadRequestException(i18n.t('common.user.Data id not found', { args: { id } }));
    }
    return data;
  }

  async history(newData: any, status = 'UPDATED') {
    const originalID = newData.id;
    if (status === 'UPDATED') {
      const oldData = await this.repoHistory
        .createQueryBuilder('base')
        .where('base.originalID = :originalID', { originalID })
        .orderBy('base.createdAt', 'DESC')
        .getOne();
      if (oldData) {
        let checkDifferent = false;
        this.listHistoryKey.forEach((key: string) => {
          if (!checkDifferent && newData[key]?.toString() != oldData[key]?.toString()) {
            checkDifferent = true;
          }
        });
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
