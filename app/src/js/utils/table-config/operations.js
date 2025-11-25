import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import isNil from 'lodash/isNil';
import { Link } from 'react-router-dom';
import { fromNowWithTooltip, displayCase } from '../format';
import ErrorReport from '../../components/Errors/report';
import ShowMoreOrLess from '../../components/Errors/show-more-or-less';
import CopyToClipboard from '../../components/Errors/copy-to-clipboard';
import { getPersistentQueryParams } from '../url-helper';

const AsyncIdCell = ({ row: { original: { id } } }) => (
  <Link to={(location) => ({ pathname: `/operations/operation/${id}`, search: getPersistentQueryParams(location) })} title={id}>{id}</Link>
);

AsyncIdCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const OutputCell = ({ row: { original } }) => {
  const output = get(original, 'output');
  const status = get(original, 'status');

  // Handle null, undefined, or empty string gracefully
  if (isNil(output) || output === '') {
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
};

OutputCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.object.isRequired
  }).isRequired
};

export const tableColumns = [
  {
    Header: 'Status',
    accessor: (row) => displayCase(row.status),
    id: 'status'
  },
  {
    Header: 'Async ID',
    accessor: 'id',
    Cell: AsyncIdCell
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
    Cell: OutputCell,
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
