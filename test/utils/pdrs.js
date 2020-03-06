'use strict';
import test from 'ava';
import {tableColumns} from '../../app/src/js/utils/table-config/pdrs.js';
import {getProgress} from '../../app/src/js/utils/table-config/pdr-progress.js';
const pdr =
  {
    'pdrName': 'test-4.PDR',
    'collectionId': 'MOD09GQ___006',
    'status': 'running',
    'provider': 's3_provider',
    'progress': 0,
    'execution': 'execuation-arn-7a2136d9-e07a-4d94-9080-aef7206e8192',
    'PANSent': false,
    'PANmessage': 'N/A',
    'stats': {
      'processing': 0,
      'completed': 1,
      'failed': 3,
      'total': 4
    },
    'createdAt': 1519415184827,
    'timestamp': 1519415185353,
    'duration': 0.526
  };

test('test pdr-progress.js getProgress', function (t) {
  const result = getProgress(pdr);
  t.is(result.percentCompleted, 25);
  t.is(result.percentFailed, 75);
  t.is(result.granulesCompleted, '4/4');
});

test('test pdrs.js tableRow', function (t) {
  t.is(tableColumns[4].accessor(pdr), 4);
  t.is(tableColumns[5].accessor(pdr), pdr.stats.processing);
  t.is(tableColumns[6].accessor(pdr), pdr.stats.failed);
  t.is(tableColumns[7].accessor(pdr), pdr.stats.completed);
});
