import React from 'react';
import { get } from 'object-path';
import { fromNowWithTooltip, displayCase } from '../format';
import ErrorReport from '../../components/Errors/report';

export const tableColumns = [
  {
    Header: 'Status',
    accessor: (row) => displayCase(row.status),
    id: 'status'
  },
  {
    Header: 'Async ID',
    accessor: 'id'
  },
  {
    Header: 'Description',
    accessor: 'description',
    disableSortBy: true
  },
  {
    Header: 'Type',
    accessor: 'operationType'
  },
  {
    Header: 'Output',
    accessor: (row) => get(row, 'output'),
    id: 'output',
    Cell: ({ row: { original } }) => { // eslint-disable-line react/prop-types
      const output = get(original, 'output');
      const status = get(original, 'status');
      
      // Handle null, undefined, or empty string gracefully
      if (output === null || output === undefined || output === '') {
        return null;
      }
      
      const isFailed = status === 'RUNNER_FAILED' || status === 'TASK_FAILED';
      
      if (isFailed) {
        // Display as error using ErrorReport for failed operations
        return <ErrorReport report={output} truncate={true} disableScroll={true} />;
      }
      
      // Display as JSON output for succeeded or other statuses
      try {
        const parsedOutput = typeof output === 'string' ? JSON.parse(output) : output;
        return <pre style={{ maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{JSON.stringify(parsedOutput, null, 2)}</pre>;
      } catch (e) {
        // If JSON parsing fails, display as raw string
        return <pre style={{ maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{String(output)}</pre>;
      }
    },
    disableSortBy: true,
    width: 200
  },
  {
    Header: 'Updated',
    accessor: 'updatedAt',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'updatedAt'
  }
];

export default tableColumns;
