import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { User } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   *
   * @param id
   * @param email
   * @returns User
   *
   */
  async getDataByIdAndEmail(id: string, email: string): Promise<User> {
    return await this.createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id })
      .andWhere(`base.email=:email`, { email })
      .getOne();
  }

  /**
   *
   * @param id
   * @param email
   * @returns User
   *
   */
  async getDataByIdAndEmailJoinRole(id: string, email: string): Promise<User> {
    return await this.createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id })
      .andWhere(`base.email=:email`, { email })
      .leftJoinAndSelect('base.role', 'role')
      .getOne();
  }

  /**
   *
   * @param id
   * @param email
   * @param token
   * @returns User
   *
   */
  async getDataByResetPassword(id: string, email: string, token: string): Promise<User> {
    return await this.createQueryBuilder('base')
      .andWhere(`base.id=:id`, { id })
      .andWhere(`base.email=:email`, { email })
      .andWhere(`base.resetPasswordToken=:token`, { token })
      .getOne();
  }

  /**
   *
   * @param email
   * @returns User
   *
   */
  async getDataByEmail(email: string): Promise<User> {
    return await this.createQueryBuilder('base').andWhere(`base.email=:email`, { email }).getOne();
  }

  /**
   *
   * @param email
   * @returns User
   *
   */
  async getDataByEmailJoin(email: string): Promise<User> {
    return await this.createQueryBuilder('base')
      .andWhere(`base.email=:email`, { email })
      .leftJoinAndSelect('base.role', 'role')
      .leftJoinAndSelect('base.position', 'position')
      .getOne();
  }

  async getCountByManagerId(managerId: string) {
    return await this.createQueryBuilder('base').andWhere(`base.managerId = :managerId`, { managerId }).getCount();
  }
}
