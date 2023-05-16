import { testCase } from './index';

import { P_PAGE_LISTED, P_PAGE_CREATE, P_PAGE_UPDATE, P_PAGE_DELETE } from '@services';

describe('Role - /api/page', () => testCase('Role', [P_PAGE_LISTED, P_PAGE_CREATE, P_PAGE_UPDATE, P_PAGE_DELETE]));
