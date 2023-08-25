import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { User } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getDataByIdAndEmail(id: string, email: string) {
    return await this.createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id })
      .andWhere(`base.email=:email`, { email })
      .getOne();
  }

  async getDataByIdAndEmailJoinRole(id: string, email: string) {
    return await this.createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id })
      .andWhere(`base.email=:email`, { email })
      .leftJoinAndSelect('base.role', 'role')
      .getOne();
  }

  async getDataByResetPassword(id: string, email: string, token: string) {
    return await this.createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id })
      .andWhere(`base.email=:email`, { email })
      .andWhere(`base.resetPasswordToken=:token`, { token })
      .getOne();
  }

  async getDataByEmail(email: string) {
    return await this.createQueryBuilder('base').andWhere(`base.email=:email`, { email }).getOne();
  }

  async getDataByEmailJoin(email: string) {
    return await this.createQueryBuilder('base')
      .andWhere(`base.email=:email`, { email })
      .leftJoinAndSelect('base.role', 'role')
      .leftJoinAndSelect('base.position', 'position')
      .getOne();
  }
}
