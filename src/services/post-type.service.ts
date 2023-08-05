import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@common';
import { Post, PostType } from '@entities';
import { I18nContext } from 'nestjs-i18n';

export const P_POST_TYPE_LISTED = 'efa34c52-8c9a-444d-a82b-8bec109dbab5';
export const P_POST_TYPE_CREATE = '87cb77c4-565c-43ec-bffc-fbaf5077c2be';
export const P_POST_TYPE_UPDATE = 'bfa36cef-71c4-4f08-89e6-d7e0c1c03ba4';
export const P_POST_TYPE_DELETE = 'cd00c62e-1ec4-4c61-b273-cdd6867a3212';

@Injectable()
export class PostTypeService extends BaseService {
  constructor(
    @InjectRepository(PostType)
    public repo: Repository<PostType>,
    @InjectRepository(Post)
    public repoPost: Repository<Post>,
  ) {
    super(repo);
  }
  async removeCheck(id: string, i18n: I18nContext) {
    const data = await this.findOne(id, [], i18n);
    const count = await this.repoPost
      .createQueryBuilder('base')
      .where(`base.type=:code`, { code: data.code })
      .withDeleted()
      .getCount();
    if (count > 0)
      throw new BadRequestException(i18n.t(`common.user.Can't be deleted because there's still link data`));
    return await this.removeHard(id, i18n);
  }
}
