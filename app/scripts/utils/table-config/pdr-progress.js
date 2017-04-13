'use strict';
import React from 'react';
import { Link } from 'react-router';
import { get } from 'object-path';
import { tally, bool, fromNow } from '../format';

import statusOptions from '../status';
const stats = Object.keys(statusOptions).map(d => statusOptions[d]).filter(Boolean);

function bar (completed, failed, text) {
  // show a sliver even if there's no progress
  return (
    <div className='table__progress--outer'>
      <div className='table__progress--bar'
        style={{width: completed + '%'}} />
      <div className='table__progress--bar table__progress--bar--failed'
        style={{width: failed + '%', left: completed + '%'}} />
      {!completed && !failed ? (
        <div className='table__progress--bar'
          style={{width: '0.5%'}} />
      ) : null}
      <div className='table__progress--text'
        style={{left: (completed + failed) + '%'}}>{text}</div>
    </div>
  );
}

export const renderProgress = function (d) {
  const granules = d.granulesStatus;
  const total = stats.reduce((a, b) => a + get(granules, b, 0), 0);
  const completed = get(granules, 'completed', 0);
  const failed = get(d, 'granulesStatus.failed', 0);
  const percentCompleted = !total ? 0 : completed / total * 100;
  const percentFailed = !total ? 0 : failed / total * 100;
  const granulesCompleted = `${tally(completed + failed)}/${tally(total)}`;
  return (
    <div className='table__progress'>
      {bar(percentCompleted, percentFailed, granulesCompleted)}
    </div>
  );
};

export const tableHeader = [
  'Name',
  'Status',
  'Progress',
  'Errors',
  'PAN/PDRD Sent',
  'Discovered'
];

export const tableRow = [
  (d) => <Link to={`pdrs/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
  'status',
  renderProgress,
  (d) => tally(get(d, 'granulesStatus.failed', 0)),
  (d) => bool(d.PANSent || d.PDRDSent),
  (d) => fromNow(d.discoveredAt)
];

export const tableSortProps = [
  'pdrName.keyword',
  'status.keyword',
  'progress',
  null,
  null,
  'discoveredAt'
];
