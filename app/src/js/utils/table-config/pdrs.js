import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'object-path';
import { seconds, bool, nullValue, collectionLink, displayCase, granuleLink, fromNowWithTooltip, deletePdrs, deleteGranules } from '../format';
import { deleteGranule, deletePdr } from '../../actions';
import ErrorReport from '../../components/Errors/report';
import { strings } from '../../components/locale';
import { getPersistentQueryParams } from '../url-helper';

export const tableColumns = [
  {
    Header: 'Updated',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'timestamp'
  },
  {
    Header: 'Name',
    accessor: 'pdrName',
    Cell: ({ cell: { value } }) => <Link to={(location) => ({ pathname: `/pdrs/pdr/${value}`, search: getPersistentQueryParams(location) })}>{value}</Link> // eslint-disable-line react/prop-types
  },
  {
    Header: 'Status',
    accessor: 'status'
  },
  {
    Header: 'Duration',
    accessor: (row) => seconds(row.duration),
    id: 'duration'
  },
  {
    Header: strings.granules,
    accessor: (row) => get(row, ['stats', 'total'], 0),
    id: 'granules'
  },
  {
    Header: 'Processing',
    accessor: (row) => get(row, ['stats', 'processing'], 0),
    id: 'processing'
  },
  {
    Header: 'Failed',
    accessor: (row) => get(row, ['stats', 'failed'], 0),
    id: 'failed'
  },
  {
    Header: 'Completed',
    accessor: (row) => get(row, ['stats', 'completed'], 0),
    id: 'completed'
  }
];

export const errorTableColumns = [
  {
    Header: 'Updated',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'timestamp'
  },
  {
    Header: 'Name',
    accessor: 'pdrName',
    Cell: ({ cell: { value } }) => <Link to={(location) => ({ pathname: `/pdrs/pdr/${value}`, search: getPersistentQueryParams(location) })}>{value}</Link> // eslint-disable-line react/prop-types
  },
  {
    Header: 'Error',
    accessor: (row) => get(row, 'error.Cause', nullValue),
    id: 'error',
    Cell: ({ row: { original } }) => ( // eslint-disable-line react/prop-types
      <ErrorReport report={get(original, 'error.Cause', nullValue)} truncate={true} />),
    disableSortBy: true,
    width: 175
  },
  {
    Header: 'Type',
    accessor: (row) => get(row, 'error.Error', nullValue),
    id: 'type',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'PAN Sent',
    accessor: (row) => bool(row.PANSent),
    id: 'panSent'
  },
  {
    Header: 'PAN Message',
    accessor: 'PANmessage'
  }
];

const confirmDelete = (d) => deletePdrs(d);
export const bulkActions = (pdrs) => [{
  text: 'Delete',
  action: deletePdr,
  state: pdrs.deleted,
  confirm: confirmDelete
}];

export const granuleTableColumns = [
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ cell: { value } }) => displayCase(value)
  },
  {
    Header: 'Name',
    accessor: 'granuleId',
    Cell: ({ cell: { value } }) => granuleLink(value),
    width: 200
  },
  {
    Header: strings.collection_id,
    accessor: 'collectionId',
    Cell: ({ cell: { value } }) => collectionLink(value)
  },
  {
    Header: 'Duration',
    accessor: (row) => seconds(row.duration),
    id: 'duration'
  },
  {
    Header: 'Updated',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'timestamp'
  }
];

const confirmGranuleDelete = (d) => deleteGranules(d);
export const granuleBulkActions = (granules) => [{
  text: 'Delete',
  action: deleteGranule,
  state: granules.deleted,
  confirm: confirmGranuleDelete
}];
