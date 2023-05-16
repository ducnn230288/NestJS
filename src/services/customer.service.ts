import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@common';
import { Customer } from '@entities';

export const P_CUSTOMER_LISTED = '42522730-a9cb-41eb-9d94-688621e5725f';
export const P_CUSTOMER_DETAIL = '8a4285d6-3b42-4f19-81a9-ed2467c6a2e6';
export const P_CUSTOMER_CREATE = 'cc2f9836-07af-4e81-a9bc-946099dbb87d';
export const P_CUSTOMER_UPDATE = '801bf1da-a1b5-4b49-b283-6cda0d1ecf89';
export const P_CUSTOMER_DELETE = '0b1a94d2-6da0-42de-8a37-56d367980b36';

@Injectable()
export class CustomerService extends BaseService {
  constructor(
    @InjectRepository(Customer)
    public repo: Repository<Customer>,
  ) {
    super(repo);
    this.listQuery = ['name', 'email', 'phoneNumber', 'message', 'note'];
  }
}
