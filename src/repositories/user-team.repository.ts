import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { UserTeam } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class UserTeamRepository extends BaseRepository<UserTeam> {
  constructor(private readonly dataSource: DataSource) {
    super(UserTeam, dataSource.createEntityManager());
  }

  /**
   *
   * @param ids
   * @returns UserTeam[]
   *
   */
  async getManyByArrayId(ids: string[]): Promise<UserTeam[]> {
    return await this.createQueryBuilder('base').where(`base.id IN (:...ids)`, { ids }).withDeleted().getMany();
  }

  /**
   *
   * @param managerId
   * @returns UserTeam[]
   *
   */
  async getCountByManagerId(managerId: string): Promise<UserTeam[]> {
    return await this.createQueryBuilder('base').andWhere(`base.managerId=:managerId`, { managerId }).getMany();
  }
}
