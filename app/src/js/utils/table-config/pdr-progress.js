'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'object-path';
import { tally, bool, fromNow, nullValue } from '../format';
import ErrorReport from '../../components/Errors/report';

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

export const getProgress = function (row) {
  const granules = row.stats;
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

export const renderProgress = function (row) {
  // if the status is failed, return it as such
  if (row.status === 'failed') {
    const error = get(row, 'error', nullValue);
    return <ErrorReport report={error} truncate={true} />;
  } else if (typeof row.status === 'undefined') return null;
  const progress = getProgress(row);
  return (
    <div className='table__progress'>
      {bar(progress.percentCompleted, progress.percentFailed, progress.granulesCompleted)}
    </div>
  );
};

export const tableColumns = [
  {
    Header: 'Name',
    accessor: row => <Link to={`pdrs/pdr/${row.pdrName}`}>{row.pdrName}</Link>,
    id: 'name'
  },
  {
    Header: 'Status',
    accessor: 'status'
  },
  {
    Header: 'Progress',
    accessor: renderProgress,
    id: 'progress'
  },
  {
    Header: 'Errors',
    accessor: row => tally(get(row, 'granulesStatus.failed', 0)),
    id: 'errors'
  },
  {
    Header: 'PAN/PDRD Sent',
    accessor: row => bool(row.PANSent || row.PDRDSent),
    id: 'panPdrdSent'
  },
  {
    Header: 'Discovered',
    accessor: row => fromNow(row.timestamp),
    id: 'timestamp'
  }
];

