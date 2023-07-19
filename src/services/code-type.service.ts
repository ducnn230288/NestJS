import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@common';
import { CodeType } from '@entities';
import { I18nContext } from 'nestjs-i18n';

export const P_CODE_TYPE_LISTED = '2a71d57d-7c2d-49ad-a7e9-3cd4aace132f';
export const P_CODE_TYPE_DETAIL = '7af26c77-e81f-4875-89df-9d4c2fa3ce52';
export const P_CODE_TYPE_CREATE = '45f014c0-9ebe-497e-9766-2054ebb7e1d5';
export const P_CODE_TYPE_UPDATE = 'fdb47b79-1a6e-49be-8f5b-8525a547534a';
export const P_CODE_TYPE_DELETE = 'f16e2bc7-12b9-446e-b53b-a2597ca0ad3a';

@Injectable()
export class CodeTypeService extends BaseService {
  constructor(
    @InjectRepository(CodeType)
    public repo: Repository<CodeType>,
  ) {
    super(repo);
    this.listJoin = ['items'];
  }

  async findOneCode(code: string, i18n: I18nContext) {
    const data = await this.repo
      .createQueryBuilder('base')
      .where(`base.code=:code`, { code })
      .leftJoinAndMapMany('base.items', 'Code', 'code', 'base.code = code.type')
      .addOrderBy('code.createdAt', 'ASC')
      .withDeleted()
      .getOne();

    if (!data) {
      throw new BadRequestException(i18n.t('common.user.Data id not found', { args: { id: code } }));
    }
    return data;
  }
}
