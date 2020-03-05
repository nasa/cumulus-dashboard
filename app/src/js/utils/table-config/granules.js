'use strict';
import path from 'path';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router-dom';
import {
  fromNow,
  seconds,
  bool,
  nullValue,
  displayCase,
  collectionLink,
  granuleLink
} from '../format';
import {
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import ErrorReport from '../../components/Errors/report';
import {strings} from '../../components/locale';
import Dropdown from '../../components/DropDown/simple-dropdown';

export const tableColumns = [
  {
    Header: 'Status',
    accessor: row => <Link to={`/granules/${row.status}`} className={`granule__status granule__status--${row.status}`}>{displayCase(row.status)}</Link>,
    id: 'status',
    width: 100
  },
  {
    Header: 'Name',
    accessor: row => granuleLink(row.granuleId),
    id: 'name',
    width: 225
  },
  {
    Header: 'Published',
    accessor: row => row.cmrLink ? <a href={row.cmrLink} target='_blank'>{bool(row.published)}</a> : bool(row.published),
    id: 'published'
  },
  {
    Header: strings.collection_id,
    accessor: row => collectionLink(row.collectionId),
    id: 'collectionId'
  },
  {
    Header: 'Execution',
    accessor: row => <Link to={`/executions/execution/${path.basename(row.execution)}`}>link</Link>,
    id: 'execution',
    disableSortBy: true,
    width: 90
  },
  {
    Header: 'Duration',
    accessor: row => seconds(row.duration),
    id: 'duration',
    width: 100
  },
  {
    Header: 'Updated',
    accessor: row => fromNow(row.timestamp),
    id: 'timestamp'
  }
];

export const errorTableColumns = [
  {
    Header: 'Error',
    accessor: row => <ErrorReport report={get(row, 'error.Cause', nullValue)} truncate={true} />,
    id: 'error',
    disableSortBy: true,
    width: 175
  },
  {
    Header: 'Type',
    accessor: row => get(row, 'error.Error', nullValue),
    id: 'type',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Granule',
    accessor: row => granuleLink(row.granuleId),
    id: 'granuleId',
    width: 200
  },
  {
    Header: 'Duration',
    accessor: row => seconds(row.duration),
    id: 'duration'
  },
  {
    Header: 'Updated',
    accessor: row => fromNow(row.timestamp),
    id: 'timestamp'
  }
];

export const simpleDropdownOption = function (config) {
  return (
    <Dropdown
      key={config.label}
      label={config.label.toUpperCase()}
      value={config.value}
      options={config.options}
      id={config.label}
      onChange={config.handler}
      noNull={true}
    />
  );
};

const confirmRecover = (d) => `Recover ${d} granule(s)?`;
export const recoverAction = (granules, config) => ({
  text: 'Recover Granule',
  action: config.recover.action,
  state: granules.executed,
  confirm: confirmRecover
});

const confirmReingest = (d) => `Reingest ${d} granules(s)? Note: the granule files will be overwritten.`;
const confirmApply = (d) => `Run workflow on ${d} granules?`;
const confirmRemove = (d) => `Remove ${d} granule(s) from ${strings.cmr}?`;
const confirmDelete = (d) => `Delete ${d} granule(s)?`;
export const bulkActions = function (granules, config) {
  return [{
    text: 'Reingest',
    action: reingestGranule,
    state: granules.reingested,
    confirm: confirmReingest,
    className: 'button--reingest'
  }, {
    text: 'Execute',
    action: config.execute.action,
    state: granules.executed,
    confirm: confirmApply,
    confirmOptions: config.execute.options,
    className: 'button--execute'
  }, {
    text: strings.remove_from_cmr,
    action: removeGranule,
    state: granules.removed,
    confirm: confirmRemove,
    className: 'button--remove'
  }, {
    text: 'Delete',
    action: deleteGranule,
    state: granules.deleted,
    confirm: confirmDelete,
    className: 'button--delete'
  }];
};
