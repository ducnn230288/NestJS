import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { UpdatePostTypeRequestDto, UpdatePostRequestDto, CreatePostRequestDto, CreatePostTypeRequestDto } from '@dtos';
import { Post, PostType } from '@entities';

import { BaseTest } from '../base';
import { DataService, PostService, PostTypeService } from '@services';

export const testCase = (type?: string, permissions: string[] = []) => {
  beforeAll(() => BaseTest.initBeforeAll(type, permissions));
  afterAll(BaseTest.initAfterAll);

  const dataType: CreatePostTypeRequestDto = {
    name: faker.person.jobType(),
    code: faker.finance.bic(),
  };

  let resultType: PostType = {
    id: faker.string.uuid(),
    name: faker.person.jobType(),
    code: faker.finance.bic(),
    isPrimary: false,
  };

  const dataUpdate: UpdatePostRequestDto = {
    type: dataType.code,
    thumbnailUrl: faker.image.url(),
    translations: [
      {
        language: 'vn',
        name: faker.person.jobType(),
        description: faker.lorem.paragraph(),
        slug: faker.lorem.slug(),
      },
      {
        language: 'en',
        name: faker.person.jobType(),
        description: faker.lorem.paragraph(),
        slug: faker.lorem.slug(),
      },
    ],
  };

  const data: CreatePostRequestDto = {
    type: dataType.code,
    thumbnailUrl: faker.image.url(),
    translations: [
      {
        language: 'vn',
        name: faker.person.jobType(),
        description: faker.lorem.paragraph(),
        slug: faker.lorem.slug(),
      },
      {
        language: 'en',
        name: faker.person.jobType(),
        description: faker.lorem.paragraph(),
        slug: faker.lorem.slug(),
      },
    ],
  };

  const result: Post = {
    id: faker.string.uuid(),
    type: resultType.code,
    thumbnailUrl: faker.image.url(),
  };

  it('Create [POST /api/post-type]', async () => {
    await new Promise((res) => setTimeout(res, 1));
    const { body } = await request(BaseTest.server)
      .post('/api/post-type')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(dataType as CreatePostTypeRequestDto)
      .expect(type ? HttpStatus.CREATED : HttpStatus.FORBIDDEN);

    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataType));
      resultType = body.data;
    }
  });

  // it('Get all [GET /api/post-type]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/post-type')
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  //   if (type) {
  //     expect(body.data[0]).toEqual(jasmine.objectContaining(dataType));
  //   }
  // });

  // it('Get one [GET /api/post-type/:id]', async () => {
  //   if (!type) {
  //     resultType = await BaseTest.moduleFixture.get(PostTypeService).create(dataType);
  //   }
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/post-type/' + resultType.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(HttpStatus.OK);
  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(dataType));
  //   }
  // });

  // it('Update one [PUT /api/post-type/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .put('/api/post-type/' + resultType.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .send(dataType)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(dataType));
  //   }
  // });

  // it('Delete one [DELETE /api/post-type/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .delete('/api/post-type/' + resultType.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  //   if (type) {
  //     expect(body.data).toEqual(jasmine.objectContaining(dataType));
  //   }
  // });

  it('Create [POST /api/post]', async () => {

    await new Promise((res) => setTimeout(res, 1));
    const { body } = await request(BaseTest.server)
      .post('/api/post')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(data as CreatePostRequestDto)
      .expect(type ? HttpStatus.CREATED : HttpStatus.FORBIDDEN);

    const { translations, ...test } = data;
    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(test));
      resultType = body.data;
    }
  });

  // it('Get all [GET /api/post]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/post')
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  //   if (type) {
  //     const { translations, ...test } = data;
  //     expect(body.data[0]).toEqual(jasmine.objectContaining(test));
  //   }
  // });



  // it('Get one [GET /api/post/:id]', async () => {
  //   if (!type) {
  //     resultType = await BaseTest.moduleFixture.get(DataService).create(data);
  //   }
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/post/' + resultType.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(HttpStatus.OK);
  //   if (type) {
  //     body.data.translations.forEach((item: any) => {
  //       let index;
  //       data.translations.forEach((subItem: any, i: number) => {
  //         if (subItem.language === item.language) {
  //           index = i;
  //         }
  //       });
  //       expect(item).toEqual(jasmine.objectContaining(data.translations[index]));
  //       dataUpdate.translations[index].id = item.id;
  //     });
  //     body.data.translations = data.translations;
  //     expect(body.data).toEqual(jasmine.objectContaining(data));
  //   }
  // });

  // it('Delete one [DELETE /api/post/:id]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .delete('/api/post/' + resultType.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

  //   if (type) {
  //     body.data.translations.forEach((item: any) => {
  //       let index;
  //       data.translations.forEach((subItem: any, i: number) => {
  //         if (subItem.language === item.language) {
  //           index = i;
  //         }
  //       });
  //       expect(item).toEqual(jasmine.objectContaining(data.translations[index]));
  //       dataUpdate.translations[index].id = item.id;
  //     });
  //     body.data.translations = data.translations;
  //     expect(body.data).toEqual(jasmine.objectContaining(data));
  //   }
  // });


  // it(`Get all [GET /api/post/array?array=[${data.type}]]`, async () => {
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/post/array?array=[]')
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  //   if (type) {
  //     const { translations, ...test } = data;
  //     expect(body.data[0]).toEqual(jasmine.objectContaining(test));
  //   }
  // });

  // it('Get one [GET /api/post/slug/:slug]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .get('/api/post/slug/' + data.translations[0].slug)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

  //   if (type) {
  //     const { translations, ...test } = body.data;
  //     expect(test).toEqual(jasmine.objectContaining(resultType));
  //   }
  // });

  // if (type) {
  //   const { translations, ...test } = data;
  //   expect(body.data[0]).toEqual(jasmine.objectContaining(test));
  // }

  // it('Update one [PUT /api/post/:id]', async () => {

  //   const { body } = await request(BaseTest.server)
  //     .put('/api/post/' + resultType.id)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .send(dataUpdate)
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

  //   if (type) {
  //     const { translations, ...test } = dataUpdate;
  //     expect(body.data).toEqual(jasmine.objectContaining(test));
  //   }
  // });

  // it('Update one [PUT /api/post/:id/disable/:boolean]', async () => {
  //   const { body } = await request(BaseTest.server)
  //     .put(`/api/post/${resultType.id}/disable/true`)
  //     .set('Authorization', 'Bearer ' + BaseTest.token)
  //     .send()
  //     .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

  //   if (type) {
  //     body.data.translations = data.translations;
  //     expect(body.data).toEqual(jasmine.objectContaining(data));
  //   }
  // });
};
