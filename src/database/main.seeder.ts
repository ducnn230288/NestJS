import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';

import { CodeSeeder, CodeTypeSeeder, UserSeeder } from './seeds';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, CodeTypeSeeder);
    await runSeeder(dataSource, CodeSeeder);
    await runSeeder(dataSource, UserSeeder);
  }
}
