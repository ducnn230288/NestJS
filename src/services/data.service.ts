import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

import { BaseService } from '@common';
import { CreateDataRequestDto, UpdateDataRequestDto } from '@dtos';
import { Data, DataTranslation } from '@entities';

export const P_DATA_LISTED = '1db70aa0-7541-4433-b2f6-fbd7bf8bf7bb';
export const P_DATA_CREATE = 'c3ab9e11-7ba3-4afd-b5cb-c560362a3144';
export const P_DATA_UPDATE = '99ea12da-5800-4d6d-9e73-60c016a267a9';
export const P_DATA_DELETE = '2e8c8772-2505-4683-b6fa-13fa2570eee7';

@Injectable()
export class DataService extends BaseService {
  constructor(
    @InjectRepository(Data)
    public repo: Repository<Data>,
    private readonly dataSource: DataSource,
  ) {
    super(repo);
    this.listJoin = ['translations'];
  }

  async findArrayCode(types: string[]) {
    const tempData: { [key: string]: Data[] } = {};
    for (const type of types) {
      tempData[type] = (await this.findAll({ filter: { type }, sorts: { order: 'ASC' } }))[0];
    }
    return tempData;
  }

  async create({ translations, ...body }: CreateDataRequestDto, i18n: I18nContext) {
    let result = null;
    await this.dataSource.transaction(async (entityManager) => {
      result = await entityManager.save(entityManager.create(Data, { ...body }));
      if (translations) {
        for (const item of translations) {
          delete item.id;
          const existingName = await entityManager
            .createQueryBuilder(DataTranslation, 'base')
            .andWhere(`base.name=:name`, { name: item.name })
            .andWhere(`base.language=:language`, { language: item.language })
            .withDeleted()
            .getCount();
          if (existingName) {
            throw new BadRequestException(i18n.t('common.Data.name is already taken'));
          }
          await entityManager.save(entityManager.create(DataTranslation, { dataId: result.id, ...item }));
        }
      }
    });
    return result;
  }

  async update(id: string, { translations, ...body }: UpdateDataRequestDto, i18n: I18nContext) {
    let result = null;
    await this.dataSource.transaction(async (entityManager) => {
      const data = await entityManager.preload(Data, {
        id,
        ...body,
      });
      if (!data) {
        throw new BadRequestException(i18n.t('common.user.Data id not found', { args: { id } }));
      }
      result = await this.repo.save(data);
      if (translations) {
        for (const item of translations) {
          const existingName = await entityManager
            .createQueryBuilder(DataTranslation, 'base')
            .andWhere(`base.name=:name`, { name: item.name })
            .andWhere(`base.language=:language`, { language: item.language })
            .andWhere(`base.dataId != :dataId`, { dataId: id })
            .withDeleted()
            .getCount();
          if (existingName) {
            throw new BadRequestException(i18n.t('common.Data.name is already taken'));
          }
          await entityManager.save(await entityManager.preload(DataTranslation, { dataId: result.id, ...item }));
        }
      }
    });
    return result;
  }
}
