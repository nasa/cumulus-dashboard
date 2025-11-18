import React from 'react';
import { get } from 'object-path';
import { fromNowWithTooltip, displayCase } from '../format';
import ErrorReport from '../../components/Errors/report';
import ShowMoreOrLess from '../../components/Errors/show-more-or-less';
import CopyToClipboard from '../../components/Errors/copy-to-clipboard';

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
      
      // Display as JSON output for succeeded or other statuses with expand/collapse
      let displayText = output;
      
      // Try to parse as JSON if it's a string
      if (typeof output === 'string') {
        try {
          const parsed = JSON.parse(output);
          // Only stringify if it's an object or array, not if it's a primitive string
          if (typeof parsed === 'object' && parsed !== null) {
            displayText = JSON.stringify(parsed, null, 2);
          } else {
            displayText = typeof parsed === 'string' ? parsed : String(parsed);
          }
        } catch (parseError) {
          // If JSON parsing fails, display as raw string
          displayText = output;
        }
      }
      
      return (
        <div>
          <ShowMoreOrLess text={displayText} truncate={true} />
          <CopyToClipboard text={displayText} />
        </div>
      );
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
