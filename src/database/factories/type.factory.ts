import { setSeederFactory } from 'typeorm-extension';
import { CodeType } from '@entities';

export default setSeederFactory(CodeType, (faker) => {
  const data = new CodeType();
  data.name = faker.person.jobType();
  data.code = faker.finance.bic();

  return data;
});
