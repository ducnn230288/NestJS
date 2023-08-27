import { Injectable } from '@nestjs/common';

import { BaseService } from '@common';
import { Parameter } from '@entities';
import { ParameterRepository } from '@repositories';

export const P_PARAMETER_LISTED = 'd278abcb-1956-4b45-95c1-2ab612110ec6';
export const P_PARAMETER_CREATE = 'd9185449-e2ac-4e72-9c9f-25788c23d5ba';
export const P_PARAMETER_UPDATE = '3d478437-949b-4ae7-9c21-79cabb1663a3';
export const P_PARAMETER_DELETE = '275ebda7-3e03-4c93-b352-baa7705528aa';

@Injectable()
export class ParameterService extends BaseService<Parameter> {
  constructor(public repo: ParameterRepository) {
    super(repo);
    this.listQuery = ['name'];
  }

  async findOne(code: string): Promise<Parameter> {
    return this.repo.getDataByCode(code);
  }
}
