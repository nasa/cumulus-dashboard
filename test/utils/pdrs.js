'use strict';
import test from 'tape';
import {tableRow} from '../../app/scripts/utils/table-config/pdrs.js';
import {getProgress} from '../../app/scripts/utils/table-config/pdr-progress.js';
const d =
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
  const result = getProgress(d);
  t.equal(result.percentCompleted, 25);
  t.equal(result.percentFailed, 75);
  t.equal(result.granulesCompleted, '4/4');
  t.end();
});

test('test pdrs.js tableRow', function (t) {
  const result = [];
  tableRow.forEach(function (col) {
    if (col instanceof Function) {
      result.push(col(d));
    } else {
      result.push(col);
    }
  });
  t.equal(result[4], 4);
  t.equal(result[5], d.stats.processing);
  t.equal(result[6], d.stats.failed);
  t.equal(result[7], d.stats.completed);
  t.end();
});
