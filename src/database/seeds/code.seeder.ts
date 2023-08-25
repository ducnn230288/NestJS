import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Code } from '@entities';

export class CodeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Code);
    const listData: Code[] = [
      { name: 'President & CEO', code: 'PC', type: 'position' },
      { name: 'CCO', code: 'CCO', type: 'position' },
      { name: 'Vice Director', code: 'VD', type: 'position' },
      { name: 'Vice Director', code: 'VD', type: 'position' },
      { name: 'Delivery Manager', code: 'DM', type: 'position' },
      { name: 'CTO', code: 'CTO', type: 'position' },
      { name: 'Admin', code: 'AD', type: 'position' },
      { name: 'Accountant', code: 'ACC', type: 'position' },
      { name: 'Ai Technical Leader', code: 'ATL', type: 'position' },
      { name: 'Web-App Technical Leader', code: 'WATL', type: 'position' },
      { name: 'Project Technical Leader', code: 'PTL', type: 'position' },
      { name: 'Developer', code: 'DEV', type: 'position' },
      { name: 'Engineer', code: 'ENG', type: 'position' },
      { name: 'Business Analyst', code: 'BA', type: 'position' },
      { name: 'Tester', code: 'TEST', type: 'position' },
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
  }
}
