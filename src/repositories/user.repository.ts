import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { User } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getUserByEmail(email: string) {
    return this.createQueryBuilder('base').andWhere(`base.email=:email`, { email }).getOne();
  }
}
