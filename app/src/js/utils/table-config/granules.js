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
  granuleLink,
  providerLink
} from '../format';
import {
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import ErrorReport from '../../components/Errors/report';
import { strings } from '../../components/locale';
import Dropdown from '../../components/DropDown/simple-dropdown';
import Bulk from '../../components/Granules/bulk';
import BatchReingestConfirmContent from '../../components/ReingestGranules/BatchReingestConfirmContent';
import BatchReingestCompleteContent from '../../components/ReingestGranules/BatchReingestCompleteContent';

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
    Header: 'Provider',
    accessor: row => providerLink(row.provider),
    id: 'provider'
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

const confirmReingest = (d) => `Reingest ${d} Granule${d > 1 ? 's' : ''}?`;
const confirmApply = (d) => `Run workflow on ${d} granules?`;
const confirmRemove = (d) => `Remove ${d} granule(s) from ${strings.cmr}?`;
const confirmDelete = (d) => `Delete ${d} granule(s)?`;

/**
 * Determine the base context of a collection view
 * @param {Object} path - react router history object
 */
const determineCollectionsBase = (path) => {
  if (path.includes('granules')) {
    return path.replace(/\/granules.*/, '/granules');
  }
  return `${path}/granules`;
};

/**
 * Determines next location based on granule success/error and number of
 * successes.
 *   - If there's an error do nothing.
 *   - If there is a single granule visit that granule's detail page
 *   - If there are multiple granules reingested visit the running granules page.
 * Multiple granules will redirect to a base location determined by the current
 * location's pathname.
 *
 * @param {Object} anonymous
 * @param {Object} anonymous.history - Connected router history object.
 * @param {Object} anonymous.error - error object.
 * @param {Object} anonymous.selected - array of selected values.
 * @param {Function} anonymous.closeModal - function to close the Modal component.
 * @returns {Function} function to call on confirm selection.
 */
const setOnConfirm = ({ history, error, selected, closeModal }) => {
  const redirectAndClose = (redirect) => {
    return () => {
      history.push(redirect);
      if (typeof closeModal === 'function') closeModal();
    };
  };
  const baseRedirect = determineCollectionsBase(history.location.pathname);
  if (error) { return () => {}; } else {
    if (selected.length > 1) {
      return redirectAndClose(`${baseRedirect}/processing`);
    } else {
      return redirectAndClose(`/granules/granule/${selected[0]}`);
    }
  }
};

const granuleModalJourney = ({
  selected = [],
  history,
  isOnModalConfirm,
  isOnModalComplete,
  errorMessage,
  errors,
  results,
  closeModal
}) => {
  const initialEntry = !isOnModalConfirm && !isOnModalComplete;
  const modalOptions = {};
  if (initialEntry) {
    modalOptions.children = <BatchReingestConfirmContent selected={selected}/>;
  }
  if (isOnModalComplete) {
    modalOptions.children = <BatchReingestCompleteContent results={results} errorMessage={errorMessage} errors={errors} />;
    modalOptions.hasConfirmButton = !errorMessage;
    modalOptions.title = 'Reingest Granule(s)';
    modalOptions.cancelButtonText = 'Close';
    if (!errorMessage) {
      modalOptions.confirmButtonText = (selected.length > 1) ? 'View Running' : 'View Granule';
      modalOptions.cancelButtonClass = 'button--green';
      modalOptions.confirmButtonClass = 'button__goto';
      modalOptions.onConfirm = setOnConfirm({ history, selected, errorMessage, closeModal });
    }
  }
  return modalOptions;
};

export const reingestAction = (granules) => ({
  text: 'Reingest',
  action: reingestGranule,
  state: granules.reingested,
  confirm: confirmReingest,
  className: 'button--reingest',
  getModalOptions: granuleModalJourney
});

export const bulkActions = function (granules, config) {
  return [
    reingestAction(granules),
    {
      text: 'Execute',
      action: config.execute.action,
      state: granules.executed,
      confirm: confirmApply,
      confirmOptions: config.execute.options,
      className: 'button--execute'
    },
    {
      text: strings.remove_from_cmr,
      action: removeGranule,
      state: granules.removed,
      confirm: confirmRemove,
      className: 'button--remove'
    },
    {
      Component:
        <Bulk
          element='button'
          className='button button__bulkgranules button--green button--small form-group__element'
          confirmAction={true}
        />
    },
    {
      text: 'Delete',
      action: deleteGranule,
      state: granules.deleted,
      confirm: confirmDelete,
      className: 'button--delete'
    }];
};
