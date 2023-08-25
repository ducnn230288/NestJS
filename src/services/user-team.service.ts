import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@common';
import { UserTeam } from '@entities';
// import { User } from '@modules/user/user.entity';
// import { UserHistory } from '@modules/user/user.history';
// import { UserTeamHistory } from '@modules/user/team/team.history';

export const P_USER_TEAM_LISTED = '894a30a1-3998-4a31-a02d-76ff8e9e8479';
export const P_USER_TEAM_DETAIL = '3c140e6d-eb76-4595-9780-151cfa7501d6';
export const P_USER_TEAM_CREATE = 'aa1da8b6-e2b6-4e50-b7e1-713e0565c50c';
export const P_USER_TEAM_UPDATE = '8cbfcd72-746d-4d40-bef2-034520769b43';
export const P_USER_TEAM_DELETE = 'a3988171-8aaa-4925-9a8b-8e3190d92fd4';

@Injectable()
export class UserTeamService extends BaseService<UserTeam> {
  constructor(
    @InjectRepository(UserTeam)
    public repo: Repository<UserTeam>, // @InjectRepository(UserTeamHistory) // public repoHistory: Repository<UserTeamHistory>, // @InjectRepository(UserHistory) // public repoHistoryUser: Repository<UserHistory>,
  ) {
    super(repo);
    this.listQuery = ['name', 'description'];
    this.listJoin = ['manager'];
    this.listJoinCount = [{ name: 'countUser', key: 'users' }];
  }

  // async history(newData: User, status = 'UPDATED') {
  //   const originalID = newData.id;
  //   if (status === 'UPDATED') {
  //     const oldData = await this.repoHistory
  //       .createQueryBuilder('base')
  //       .where('base.originalID = :originalID', { originalID })
  //       .orderBy('base.createdAt', 'DESC')
  //       .getOne();
  //     if (oldData) {
  //       const keys: string[] = ['name', 'description', 'managerId'];
  //       let checkDifferent = false;
  //       keys.forEach((key: string) => {
  //         if (!checkDifferent && newData[key]?.toString() != oldData[key]?.toString()) {
  //           checkDifferent = true;
  //         }
  //       });
  //       if (!checkDifferent) {
  //         return false;
  //       }
  //     }
  //   }
  //
  //   delete newData.id;
  //   delete newData.createdAt;
  //   if (newData.managerId) {
  //     newData.managerId = (
  //       await this.repoHistoryUser
  //         .createQueryBuilder('base')
  //         .where('base.originalID = :originalID', { originalID: newData.managerId })
  //         .orderBy('base.createdAt', 'DESC')
  //         .getOne()
  //     ).id;
  //   }
  //   const data = this.repoHistory.create({ ...newData, originalID, action: status });
  //   await this.repoHistory.save(data);
  // }
}
