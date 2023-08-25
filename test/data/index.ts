import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { CreateDataTypeRequestDto, UpdateDataTypeRequestDto, CreateDataRequestDto, UpdateDataRequestDto } from '@dtos';
import { Data, DataType } from '@entities';

import { BaseTest } from '../base';
import { DataService, DataTypeService } from '@services';

export const testCase = (type?: string, permissions: string[] = []) => {
  beforeAll(() => BaseTest.initBeforeAll(type, permissions));
  afterAll(BaseTest.initAfterAll);

  const dataType: CreateDataTypeRequestDto = {
    name: faker.person.jobType(),
    code: faker.finance.bic(),
  };
  const dataUpdateType: UpdateDataTypeRequestDto = {
    name: faker.person.jobType(),
  };
  let resultType: DataType = {
    id: faker.string.uuid(),
    name: faker.person.jobType(),
    code: faker.finance.bic(),
    isPrimary: false,
  };

  const data: CreateDataRequestDto = {
    type: dataType.code,
    image: faker.image.url(),
    translations: [
      {
        language: 'vn',
        name: faker.person.jobType(),
        description: faker.lorem.paragraph(),
      },
      {
        language: 'en',
        name: faker.person.jobType(),
        description: faker.lorem.paragraph(),
      },
    ],
    order: 1,
  };

  const dataUpdate: UpdateDataRequestDto = {
    type: dataType.code,
    image: faker.image.url(),
    translations: [
      {
        language: 'vn',
        name: faker.person.jobType(),
        description: faker.lorem.paragraph(),
      },
      {
        language: 'en',
        name: faker.person.jobType(),
        description: faker.lorem.paragraph(),
      },
    ],
    order: 2,
  };

  let result: Data = {
    id: faker.string.uuid(),
    type: resultType.code,
    image: faker.image.url(),
  };
  it('Create [POST /api/data-type]', async () => {
    await new Promise((res) => setTimeout(res, 1));
    const { body } = await request(BaseTest.server)
      .post('/api/data-type')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(dataType as CreateDataTypeRequestDto)
      .expect(type ? HttpStatus.CREATED : HttpStatus.FORBIDDEN);

    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataType));
      resultType = body.data;
    }
  });

  it('Get all [GET /api/data-type]', async () => {
    const { body } = await request(BaseTest.server)
      .get('/api/data-type')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
    if (type) {
      expect(body.data[0]).toEqual(jasmine.objectContaining(dataType));
    }
  });

  it('Get one [GET /api/data-type/:id]', async () => {
    if (!type) {
      resultType = await BaseTest.moduleFixture.get(DataTypeService).create(dataType);
    }
    const { body } = await request(BaseTest.server)
      .get('/api/data-type/' + resultType.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(HttpStatus.OK);
    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataType));
    }
  });

  it('Update one [PUT /api/data-type/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .put('/api/data-type/' + resultType.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(dataUpdateType)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataUpdateType));
    }
  });

  it('Create [POST /api/data]', async () => {
    await new Promise((res) => setTimeout(res, 1));
    const { body } = await request(BaseTest.server)
      .post('/api/data/')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(data)
      .expect(type ? HttpStatus.CREATED : HttpStatus.FORBIDDEN);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { translations, ...test } = data;
    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(test));
      result = body.data;
    }
  });

  it('Get all [GET /api/data]', async () => {
    const { body } = await request(BaseTest.server)
      .get('/api/data/')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

    if (type) {
      // body.data[0].translations.forEach((item: any) => {
      //   let index;
      //   data.translations.forEach((subItem: any, i: number) => {
      //     if (subItem.language === item.language) {
      //       index = i;
      //     }
      //   });
      //   expect(item).toEqual(jasmine.objectContaining(data.translations[index]));
      // });
      // body.data[0].translations = data.translations;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { translations, ...test } = data;
      expect(body.data[0]).toEqual(jasmine.objectContaining(test));
    }
  });

  it('Get one [GET /api/data/:id]', async () => {
    if (!type) {
      result = await BaseTest.moduleFixture.get(DataService).create(data);
    }
    const { body } = await request(BaseTest.server)
      .get('/api/data/' + result.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(HttpStatus.OK);
    if (type) {
      body.data.translations.forEach((item: any) => {
        let index;
        data.translations.forEach((subItem: any, i: number) => {
          if (subItem.language === item.language) {
            index = i;
          }
        });
        expect(item).toEqual(jasmine.objectContaining(data.translations[index]));
        dataUpdate.translations[index].id = item.id;
      });
      body.data.translations = data.translations;
      expect(body.data).toEqual(jasmine.objectContaining(data));
    }
  });

  it('Update one [PUT /api/data/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .put('/api/data/' + result.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(dataUpdate)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

    if (type) {
      // body.data.translations.forEach((item: any) => {
      //   let index;
      //   data.translations.forEach((subItem: any, i: number) => {
      //     if (subItem.language === item.language) {
      //       index = i;
      //     }
      //   });
      //   expect(item).toEqual(jasmine.objectContaining(dataUpdate.translations[index]));
      //   dataUpdate.translations[index].id = item.id;
      // });
      // body.data.translations = dataUpdate.translations;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { translations, ...test } = dataUpdate;
      expect(body.data).toEqual(jasmine.objectContaining(test));
    }
  });

  it('Delete one [DELETE /api/data/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .delete('/api/data/' + result.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
    if (type) {
      // body.data.translations.forEach((item: any) => {
      //   let index;
      //   data.translations.forEach((subItem: any, i: number) => {
      //     if (subItem.language === item.language) {
      //       index = i;
      //     }
      //   });
      //   expect(item).toEqual(jasmine.objectContaining(dataUpdate.translations[index]));
      // });
      // body.data.translations = dataUpdate.translations;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { translations, ...test } = dataUpdate;
      expect(body.data).toEqual(jasmine.objectContaining(test));
    }
  });

  it('Delete one [DELETE /api/data-type/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .delete('/api/data-type/' + resultType.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataUpdateType));
    }
  });
};
