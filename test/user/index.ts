import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { Example } from '@common';
import { CreateUserRoleRequestDto, UpdateUserRoleRequestDto, CreateUserRequestDto, UpdateUserRequestDto } from '@dtos';
import { User, UserRole } from '@entities';
import { P_USER_CREATE, P_USER_UPDATE } from '@services';

import { BaseTest } from '../base';

export const testCase = (type?: string, permissions: string[] = []) => {
  beforeAll(() => BaseTest.initBeforeAll(type, permissions));
  afterAll(BaseTest.initAfterAll);

  const dataRole: CreateUserRoleRequestDto = {
    name: faker.person.jobType(),
    code: faker.string.alpha(),
    isSystemAdmin: true,
    permissions: [P_USER_CREATE],
  };
  const dataUpdateRole: UpdateUserRoleRequestDto = {
    name: faker.person.jobType(),
    isSystemAdmin: false,
    permissions: [P_USER_UPDATE],
  };
  let resultRole: UserRole = {
    id: faker.string.uuid(),
    code: faker.string.alpha(),
    name: faker.person.jobType(),
    isSystemAdmin: false,
    permissions: [],
  };

  const data: CreateUserRequestDto = {
    avatar: faker.image.url(),
    name: faker.person.fullName(),
    password: Example.password,
    retypedPassword: Example.password,
    email: faker.internet.email().toLowerCase(),
    phoneNumber: faker.phone.number('0#########'),
    dob: faker.date.birthdate(),
    description: faker.lorem.paragraph(),
    startDate: faker.date.past(),
    roleCode: resultRole.code,
  };

  const dataUpdate: UpdateUserRequestDto = {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phoneNumber: faker.phone.number('0#########'),
    dob: faker.date.birthdate(),
    startDate: faker.date.past(),
    description: faker.lorem.paragraph(),
    avatar: faker.image.url(),
    roleCode: resultRole.code,
  };

  let result: User = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phoneNumber: faker.phone.number('0#########'),
    dob: faker.date.birthdate(),
    startDate: faker.date.past(),
    positionCode: 'DEV',
    description: faker.lorem.paragraph(),
    avatar: faker.image.url(),
    dateLeave: faker.number.int({ min: 0.5, max: 12 }),
    dateOff: faker.number.int({ min: 0.5, max: 12 }),
  };
  it('Create [POST /api/user-role]', async () => {
    await new Promise((res) => setTimeout(res, 1));
    const { body } = await request(BaseTest.server)
      .post('/api/user-role')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(dataRole)
      .expect(type ? HttpStatus.CREATED : HttpStatus.FORBIDDEN);

    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataRole));
      resultRole = body.data;
    }
  });

  it('Get all [GET /api/user-role]', async () => {
    const { body } = await request(BaseTest.server)
      .get('/api/user-role')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
    if (type) {
      expect(body.data[0]).toEqual(jasmine.objectContaining(dataRole));
    }
  });

  it('Get one [GET /api/user-role/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .get('/api/user-role/' + resultRole.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataRole));
    }
  });

  it('Get one [GET /api/user-role/permission]', async () => {
    await request(BaseTest.server)
      .get('/api/user-role/permission')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
  });

  it('Update one [PUT /api/user-role/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .put('/api/user-role/' + resultRole.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(dataUpdateRole)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataUpdateRole));
    }
  });

  it('Create [POST /api/user]', async () => {
    data.roleCode = resultRole.code;
    dataUpdate.roleCode = resultRole.code;
    await new Promise((res) => setTimeout(res, 1));
    const { body } = await request(BaseTest.server)
      .post('/api/user/')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(data)
      .expect(type ? HttpStatus.CREATED : HttpStatus.FORBIDDEN);
    if (type) {
      delete data.password;
      delete data.retypedPassword;
      delete data.description;
      delete data.roleCode;
      body.data.dob = new Date(body.data.dob);
      body.data.startDate = new Date(body.data.startDate);
      expect(body.data).toEqual(jasmine.objectContaining(data));
      result = body.data;
    }
  });

  it('Get all [GET /api/user]', async () => {
    const { body } = await request(BaseTest.server)
      .get('/api/user/')
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

    if (type) {
      delete data.dob;
      delete data.startDate;
      expect(body.data[0]).toEqual(jasmine.objectContaining(data));
    }
  });

  it('Get one [GET /api/user/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .get('/api/user/' + result.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

    if (type) {
      body.data.dob = new Date(body.data.dob);
      body.data.startDate = new Date(body.data.startDate);
      expect(body.data).toEqual(jasmine.objectContaining(data));
    }
  });

  it('Update one [PUT /api/user/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .put('/api/user/' + result.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .send(dataUpdate)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);

    if (type) {
      body.data.dob = new Date(body.data.dob);
      body.data.startDate = new Date(body.data.startDate);
      expect(body.data).toEqual(jasmine.objectContaining(dataUpdate));
    }
  });

  it('Delete one [DELETE /api/user/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .delete('/api/user/' + result.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
    if (type) {
      body.data.dob = new Date(body.data.dob);
      body.data.startDate = new Date(body.data.startDate);
      expect(body.data).toEqual(jasmine.objectContaining(dataUpdate));
    }
  });

  it('Delete one [DELETE /api/user-role/:id]', async () => {
    const { body } = await request(BaseTest.server)
      .delete('/api/user-role/' + resultRole.id)
      .set('Authorization', 'Bearer ' + BaseTest.token)
      .expect(type ? HttpStatus.OK : HttpStatus.FORBIDDEN);
    if (type) {
      expect(body.data).toEqual(jasmine.objectContaining(dataUpdateRole));
    }
  });
};
