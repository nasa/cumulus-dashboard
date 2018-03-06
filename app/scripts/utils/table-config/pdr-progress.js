'use strict';
import React from 'react';
import { Link } from 'react-router';
import { get } from 'object-path';
import { tally, bool, fromNow, nullValue } from '../format';
import ErrorReport from '../../components/errors/report';

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

export const getProgress = function (d) {
  const granules = d.stats;
  // granule count in all states, total is 'null' in some pdrs
  const total = Object.keys(granules).filter(k => k !== 'total')
    .reduce((a, b) => a + get(granules, b, 0), 0);
  const completed = get(granules, 'completed', 0);
  const failed = get(granules, 'failed', 0);
  const percentCompleted = !total ? 0 : completed / total * 100;
  const percentFailed = !total ? 0 : failed / total * 100;
  const granulesCompleted = `${tally(completed + failed)}/${tally(total)}`;
  return {
    percentCompleted: percentCompleted,
    percentFailed: percentFailed,
    granulesCompleted: granulesCompleted
  };
};

export const renderProgress = function (d) {
  // if the status is failed, return it as such
  if (d.status === 'failed') {
    const error = get(d, 'error', nullValue);
    return <ErrorReport report={error} truncate={true} />;
  } else if (typeof d.status === 'undefined') return null;
  const progress = getProgress(d);
  return (
    <div className='table__progress'>
      {bar(progress.percentCompleted, progress.percentFailed, progress.granulesCompleted)}
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
  (d) => fromNow(d.timestamp)
];

export const tableSortProps = [
  'pdrName.keyword',
  'status.keyword',
  'progress',
  null,
  null,
  'timestamp'
];
