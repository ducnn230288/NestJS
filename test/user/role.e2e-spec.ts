import { testCase } from './index';

import {
  P_USER_ROLE_LISTED,
  P_USER_ROLE_DETAIL,
  P_USER_ROLE_CREATE,
  P_USER_ROLE_UPDATE,
  P_USER_ROLE_DELETE,
  P_USER_LISTED,
  P_USER_DETAIL,
  P_USER_CREATE,
  P_USER_UPDATE,
  P_USER_DELETE,
} from '@services';

describe('Role - /api/user', () =>
  testCase('Role', [
    P_USER_ROLE_LISTED,
    P_USER_ROLE_DETAIL,
    P_USER_ROLE_CREATE,
    P_USER_ROLE_UPDATE,
    P_USER_ROLE_DELETE,
    P_USER_LISTED,
    P_USER_DETAIL,
    P_USER_CREATE,
    P_USER_UPDATE,
    P_USER_DELETE,
  ]));
