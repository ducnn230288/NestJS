import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@common';
import { DataType } from '@entities';

export const P_DATA_TYPE_LISTED = '2712ca04-7e7c-44b6-83c1-b8c7f332a0fb';
export const P_DATA_TYPE_CREATE = '03380c3a-3336-42f4-b8c2-e54084d35655';
export const P_DATA_TYPE_UPDATE = '00e77095-35ea-4755-bbae-46a1ba78e46e';
export const P_DATA_TYPE_DELETE = '0e481286-bd5d-4203-a374-a8f8f8735f33';

@Injectable()
export class DataTypeService extends BaseService {
  constructor(
    @InjectRepository(DataType)
    public repo: Repository<DataType>,
  ) {
    super(repo);
  }

  async findArrayCode(codes: string[]) {
    const tempData: { [key: string]: DataType } = {};
    for (const code of codes) {
      tempData[code] = await this.findCode(code);
    }
    return tempData;
  }

  async findCode(code: string) {
    const data = await this.repo
      .createQueryBuilder('base')
      .where(`base.code=:code`, { code })
      .leftJoinAndMapMany('base.items', 'Data', 'data', 'base.code = data.type')
      .addOrderBy('data.createdAt', 'ASC')
      .withDeleted()
      .getOne();
    if (!data) {
      throw new NotFoundException(`data  ${code} not found`);
    }
    return data;
  }
}
