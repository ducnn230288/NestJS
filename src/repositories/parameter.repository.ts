import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { Parameter } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class ParameterRepository extends BaseRepository<Parameter> {
  constructor(private readonly dataSource: DataSource) {
    super(Parameter, dataSource.createEntityManager());
  }

  /**
   *
   * @param code
   * @returns Parameter
   *
   */
  async getDataByCode(code: string): Promise<Parameter> {
    return await this.createQueryBuilder('base')
      .where(`base.code=:code`, { code })
      .addOrderBy('base.createdAt', 'ASC')
      .withDeleted()
      .getOne();
  }
}
