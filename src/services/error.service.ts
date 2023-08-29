import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@common';
import { Error } from '@entities';

export const P_ERROR_LISTED = '2bb2f577-b18d-494c-a797-6a4b126148ad';
export const P_ERROR_DETAIL = '60ff0528-1b62-4a51-9dcb-9121b36cc239';
export const P_ERROR_CREATE = '4473d660-cb1c-4c09-9992-7731a2bc235c';
export const P_ERROR_UPDATE = '82306e4c-2de1-4d67-bae1-9f5ee3e10496';
export const P_ERROR_DELETE = 'fd67139a-1055-48bb-b019-a982c8495651';

@Injectable()
export class ErrorService extends BaseService<Error> {
  constructor(
    @InjectRepository(Error)
    public repo: Repository<Error>,
  ) {
    super(repo);
    this.listQuery = ['name'];
  }
}
