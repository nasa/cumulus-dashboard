import React from 'react';
// import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import {
  displayCase,
  seconds,
  // fromNowWithTooltip
} from '../format';
// import { getPersistentQueryParams } from '../url-helper';
// import { getPersistentQueryParams } from '../../withUrlHelper';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    width: 150,
    isLink: true,
    linkTo: (row) => {
      const path = `/executions/execution/${row.arn}`;
      console.log('linkTo for Name column:', { row, path });
      return path;
    },
    Cell: ({ cell: { value } }) => value
  },
  {
    Header: 'Status',
    accessor: (row) => displayCase(row.status),
    id: 'status'
  },
  {
    Header: 'Workflow',
    accessor: 'type',
    width: 150
  },
  {
    Header: 'Updated',
    accessor: 'updatedAt',
    useTooltip: true,
    // Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'updatedAt'
  },
  {
    Header: 'Duration',
    accessor: (row) => seconds(row.duration),
    id: 'duration',
    width: 75
  },
  {
    Header: 'Failed Events Snapshot',
    id: 'failed',
    Cell: ({ row }) => { // eslint-disable-line react/prop-types
      const { getToggleRowExpandedProps, isExpanded } = row; // eslint-disable-line react/prop-types
      return (
        <span {...getToggleRowExpandedProps()}>
          {isExpanded ? 'Close' : 'Open'} <FontAwesomeIcon icon={isExpanded ? faChevronCircleUp : faChevronCircleDown} />
        </span>
      );
    },
  }
];

export default tableColumns;
