import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { CodeType } from '@entities';

export class CodeTypeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(CodeType);
    const data: CodeType = { name: 'Position', code: 'POS', isPrimary: true };

    const dataExists = await repository
      .createQueryBuilder('base')
      .andWhere(`base.code=:code`, { code: data.code })
      .getOne();

    if (!dataExists) {
      const newData = repository.create(data);
      await repository.save(newData);
    }

    // const userFactory = await factoryManager.get(CategoryType);
    // await userFactory.save();
    // await userFactory.saveMany(5);
  }
}
