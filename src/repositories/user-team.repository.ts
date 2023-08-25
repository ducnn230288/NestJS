import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { UserTeam } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class UserTeamRepository extends BaseRepository<UserTeam> {
  constructor(private readonly dataSource: DataSource) {
    super(UserTeam, dataSource.createEntityManager());
  }

  async getManyByArrayId(ids: string[]) {
    return await this.createQueryBuilder('base').where(`base.id IN (:...ids)`, { ids }).withDeleted().getMany();
  }

  async getCountByManagerId(managerId: string) {
    return await this.createQueryBuilder('base').andWhere(`base.managerId=:managerId`, { managerId }).getMany();
  }
}
