import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { Code, CodeType } from '@entities';
import { CreateCodeTypeRequestDto, UpdateCodeTypeRequestDto, CreateCodeRequestDto, UpdateCodeRequestDto } from '@dtos';

import { BaseTest } from '../test/base';

export const testCase = (type?: string, permissions: string[] = []) => {
  beforeAll(() => BaseTest.initBeforeAll(type, permissions));
  afterAll(BaseTest.initAfterAll);

  const dataType: CreateCodeTypeRequestDto = {
    name: faker.person.jobType(),
    code: faker.finance.bic(),
  };
  const dataUpdateType: UpdateCodeTypeRequestDto = {
    name: faker.person.jobType(),
  };
  let resultType: CodeType = {
    id: faker.string.uuid(),
    name: faker.person.jobType(),
    code: faker.finance.bic(),
  };

  const data: CreateCodeRequestDto = {
    name: faker.person.jobType(),
    code: faker.finance.bic(),
    type: dataType.code,
    description: faker.lorem.paragraph(),
  };

  const dataUpdate: UpdateCodeRequestDto = {
    name: faker.person.jobType(),
  };

  let result: Code = {
    id: faker.string.uuid(),
    name: faker.person.jobType(),
    type: resultType.code,
    code: faker.finance.bic(),
    isDisabled: faker.date.past(),

  };
  it('Create [POST /api/code-type]', async () => {
    await new Promise((res) => setTimeout(res, 1));
    const { body } = await request(BaseTest.server)
      .post('/api/code-type')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(dataType)
      .expect(type ? HttpStatus.CREATED : HttpStatus.FORBIDDEN);

    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataType));
      resultType = body.data;
    }
  });

  // it('Get all [GET /api/code-type]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/code-type')
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  //   if (type) {
  //     expect(body.data[0]).toEqual(jasmine.objectContaining(dataType));
  //   }
  // });

  // it('Get one [GET /api/code-type/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/code-type/' + resultType.code)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(dataType));
  //   }
  // });

  // it('Update one [PUT /api/code-type/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .put('/api/code-type/' + resultType.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .send(dataUpdateType)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(dataUpdateType));
  //   }
  // });

  it('Create [POST /api/code]', async () => {
    await new Promise((res) => setTimeout(res, 1));
    const { body } = await request(BaseTest.server)
      .post('/api/code/')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(data)
      .expect(type ? HttpStatus.CREATED : HttpStatus.FORBIDDEN);

    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(data));
      result = body.data;
    }
  });



  // it('Get all [GET /api/code]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/code/')
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

  //   if (type) {
  //     expect(body.data[0]).toEqual(jasmine.objectContaining(data));
  //   }
  // });

  // it('Get one [GET /api/code/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/code/' + result.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(data));
  //   }
  // });

  // it('Update one [PUT /api/code/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .put('/api/code/' + result.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .send(dataUpdate)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);


  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(dataUpdate));
  //     result = body.data;
  //   }
  // });

  it('Update one [PUT /api/code/:id/disable/:boolean]', async () => {
    const { body } = await request(BaseTest.server)
      .put('/api/code/' + result.id + '/disable/true')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send()
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(data));
    }
  });

  // it('Delete one [DELETE /api/code/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .delete('/api/code/' + result.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(dataUpdate));
  //   }
  // });

  // it('Delete one [DELETE /api/code-type/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .delete('/api/code-type/' + resultType.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(dataUpdateType));
  //   }
  // });

  it('Update one [PUT /api/code/:id/disable/:boolean]', async () => {
    const { body } = await request(BaseTest.server)
      .put('/api/code/' + result.id + '/disable/true')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send()
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
   
      if (type) {
        expect(body.data).toEqual(jasmine.objectContaining(data));
      }
  });
};
