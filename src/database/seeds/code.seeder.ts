import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Code } from '@entities';

export class CodeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Code);
    const listData: Code[] = [
      { name: 'President & CEO', code: 'PC', type: 'POS' },
      { name: 'CCO', code: 'CCO', type: 'POS' },
      { name: 'Vice Director', code: 'VD', type: 'POS' },
      { name: 'Vice Director', code: 'VD', type: 'POS' },
      { name: 'Delivery Manager', code: 'DM', type: 'POS' },
      { name: 'CTO', code: 'CTO', type: 'POS' },
      { name: 'Admin', code: 'AD', type: 'POS' },
      { name: 'Accountant', code: 'ACC', type: 'POS' },
      { name: 'Ai Technical Leader', code: 'ATL', type: 'POS' },
      { name: 'Web-App Technical Leader', code: 'WATL', type: 'POS' },
      { name: 'Project Technical Leader', code: 'PTL', type: 'POS' },
      { name: 'Developer', code: 'DEV', type: 'POS' },
      { name: 'Engineer', code: 'ENG', type: 'POS' },
      { name: 'Business Analyst', code: 'BA', type: 'POS' },
      { name: 'Tester', code: 'TEST', type: 'POS' },
    ];

    for (const data of listData) {
      const dataExists = await repository
        .createQueryBuilder('base')
        .andWhere(`base.code=:code`, { code: data.code })
        .getOne();

      if (!dataExists) {
        let newData = repository.create(data);
        newData = await repository.save(newData);
      }
    }

    // const userFactory = await factoryManager.get(CategoryType);
    // await userFactory.save();
    // await userFactory.saveMany(5);
  }
}
