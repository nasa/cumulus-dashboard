'use strict';
import test from 'tape';
import tableRow from '../../app/scripts/utils/table-config/pdrs.js';
import renderProgress from '../../app/scripts/utils/table-config/pdr-progress.js';
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

test('test pdr-progress.js renderProgress', function (t) {
  const rendered = renderProgress(d);
  console.log(rendered);
  // TODO
  t.end();
});

test('test pdrs.js tableRow', function (t) {
  const row = tableRow(d);
  console.log(row);
  // TODO
  t.end();
});
