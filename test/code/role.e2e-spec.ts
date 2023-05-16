import { testCase } from './index';

import {
  P_CODE_TYPE_LISTED,
  P_CODE_TYPE_DETAIL,
  P_CODE_TYPE_CREATE,
  P_CODE_TYPE_UPDATE,
  P_CODE_TYPE_DELETE,
  P_CODE_LISTED,
  P_CODE_DETAIL,
  P_CODE_CREATE,
  P_CODE_UPDATE,
  P_CODE_DELETE,
} from '@services';

describe('Role - /api/code', () =>
  testCase('Role', [
    P_CODE_TYPE_LISTED,
    P_CODE_TYPE_DETAIL,
    P_CODE_TYPE_CREATE,
    P_CODE_TYPE_UPDATE,
    P_CODE_TYPE_DELETE,
    P_CODE_LISTED,
    P_CODE_DETAIL,
    P_CODE_CREATE,
    P_CODE_UPDATE,
    P_CODE_DELETE,
  ]));
