import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { PostType } from '@entities';

export class PostTypeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(PostType);
    const listData: PostType[] = [
      { name: 'News', slug: 'news', isPrimary: true },
      { name: 'Projects', slug: 'projects', isPrimary: true },
    ];

    for (const data of listData) {
      const dataExists = await repository
        .createQueryBuilder('base')
        .andWhere(`base.slug=:slug`, { slug: data.slug })
        .getOne();

      if (!dataExists) {
        const newData = repository.create(data);
        await repository.save(newData);
      }
    }

    // const userFactory = await factoryManager.get(CategoryType);
    // await userFactory.save();
    // await userFactory.saveMany(5);
  }
}
