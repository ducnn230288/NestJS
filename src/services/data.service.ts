import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

import { BaseService } from '@common';
import { CreateDataRequestDto, UpdateDataRequestDto } from '@dtos';
import { Data } from '@entities';
import { DataRepository } from '@repositories';

export const P_DATA_LISTED = '1db70aa0-7541-4433-b2f6-fbd7bf8bf7bb';
export const P_DATA_CREATE = 'c3ab9e11-7ba3-4afd-b5cb-c560362a3144';
export const P_DATA_UPDATE = '99ea12da-5800-4d6d-9e73-60c016a267a9';
export const P_DATA_DELETE = '2e8c8772-2505-4683-b6fa-13fa2570eee7';

@Injectable()
export class DataService extends BaseService<Data> {
  constructor(public repo: DataRepository) {
    super(repo);
    this.listJoin = ['translations'];
  }

  /**
   *
   * @param types
   * @returns { [p]: Data[] }
   *
   */
  async findArrayCode(types: string[]): Promise<{ [p: string]: Data[] }> {
    const tempData: { [key: string]: Data[] } = {};
    for (const type of types) {
      tempData[type] = (await this.findAll({ filter: { type, isDisabled: 'NULL' }, sorts: { order: 'ASC' } }))[0];
    }
    return tempData;
  }

  /**
   *
   * @param body
   * @param i18n
   * @returns Data
   *
   */
  async create(body: CreateDataRequestDto, i18n: I18nContext): Promise<Data> {
    return this.repo.createWithTranslation(body, i18n);
  }

  /**
   *
   * @param id
   * @param body
   * @param i18n
   * @returns Data
   *
   */
  async update(id: string, body: UpdateDataRequestDto, i18n: I18nContext) {
    return this.repo.updateWithTranslation(id, body, i18n);
  }
}
