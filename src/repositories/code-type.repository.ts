import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { CodeType } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class CodeTypeRepository extends BaseRepository<CodeType> {
  constructor(private readonly dataSource: DataSource) {
    super(CodeType, dataSource.createEntityManager());
  }

  async getDataByCodeJoinItems(code: string) {
    return await this.createQueryBuilder('base')
      .where(`base.code=:code`, { code })
      .leftJoinAndMapMany('base.items', 'Code', 'code', 'base.code = code.type')
      .addOrderBy('code.createdAt', 'ASC')
      .withDeleted()
      .getOne();
  }
}
