import { testCase } from './index';

import {
  P_POST_CREATE,
  P_POST_DELETE,
  P_POST_LISTED,
  P_POST_UPDATE,
  P_POST_TYPE_CREATE,
  P_POST_TYPE_DELETE,
  P_POST_TYPE_LISTED,
  P_POST_TYPE_UPDATE
} from '@services';

describe('Role - /api/post', () =>
  testCase('Role', [
    P_POST_CREATE,
    P_POST_DELETE,
    P_POST_LISTED,
    P_POST_UPDATE,
    P_POST_TYPE_CREATE,
    P_POST_TYPE_DELETE,
    P_POST_TYPE_LISTED,
    P_POST_TYPE_UPDATE
  ]));
