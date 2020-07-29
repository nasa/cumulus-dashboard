'use strict';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router-dom';
import { fromNow, seconds, tally, collectionNameVersion } from '../format';
import { deleteCollection } from '../../actions';
import { strings } from '../../components/locale';
import BatchDeleteConfirmContent from '../../components/DeleteCollection/BatchDeleteConfirmContent';
import BatchDeleteCompleteContent from '../../components/DeleteCollection/BatchDeleteCompleteContent';
import BatchDeleteWithGranulesContent from '../../components/DeleteCollection/BatchDeleteWithGranulesContent';
import { getPersistentQueryParams, historyPushWithQueryParams } from '../url-helper';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ cell: { value, row } }) => { // eslint-disable-line react/prop-types
      const { values } = row; // eslint-disable-line react/prop-types
      return <Link to={location => ({ pathname: `/collections/collection/${value}/${values.version}`, search: getPersistentQueryParams(location) })}>{value}</Link>; // eslint-disable-line react/prop-types
    },
    width: 175
  },
  {
    Header: 'Version',
    accessor: 'version'
  },
  {
    Header: strings.granules,
    accessor: row => tally(get(row, 'stats.total')),
    id: 'granules',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Completed',
    accessor: row => tally(get(row, 'stats.completed')),
    id: 'completed',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Running',
    accessor: row => tally(get(row, 'stats.running')),
    id: 'running',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Failed',
    accessor: row => tally(get(row, 'stats.failed')),
    id: 'failed',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'MMT',
    accessor: 'mmtLink',
    Cell: ({ cell: { value } }) => value ? <a href={value} target="_blank">MMT</a> : null, // eslint-disable-line react/prop-types
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Duration',
    accessor: 'duration',
    Cell: ({ cell: { value } }) => seconds(value)
  },
  {
    Header: 'Timestamp',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fromNow(value)
  }
];

const confirmRecover = (d) => `Recover ${d} ${strings.collection}(s)?`;
export const recoverAction = function (collections, config) {
  return [{
    text: 'Recover',
    action: config.recover.action,
    state: collections.executed, // this will probably need to be changed
    confirm: confirmRecover
  }];
};

const confirmDelete = (d) => `Delete ${d} ${strings.collection}(s)?`;

export const bulkActions = function (collections) {
  const getModalOptions = ({
    selected = [],
    history,
    isOnModalConfirm,
    isOnModalComplete,
    errorMessage,
    results,
  }) => {
    const modalOptions = {};

    if (!isOnModalConfirm && !isOnModalComplete) {
      modalOptions.children = <BatchDeleteConfirmContent selected={selected} />;
    } else if (isOnModalConfirm && !isOnModalComplete) {
      const selectionsWithGranules = selected.filter(selection => {
        const { name, version } = collectionNameVersion(selection);
        const collectionItem = collections.list.data.find(item => item.name === name && item.version === version);
        return get(collectionItem, 'stats.total', 0) > 0;
      });

      if (selectionsWithGranules.length > 0) {
        modalOptions.confirmButtonText = 'Go To Granules';
        modalOptions.confirmButtonClass = 'button__goto';
        modalOptions.cancelButtonText = 'Cancel Request';
        modalOptions.title = 'Warning';
        modalOptions.onConfirm = () => {
          historyPushWithQueryParams('/granules');
        };
        modalOptions.children = <BatchDeleteWithGranulesContent selectionsWithGranules={selectionsWithGranules} />;
      }
    } else if (isOnModalComplete) {
      modalOptions.children = <BatchDeleteCompleteContent results={results} error={errorMessage} />;
      // since cancel button closes the modal, let's use that.
      modalOptions.hasConfirmButton = false;
      modalOptions.cancelButtonClass = 'button--green';
      modalOptions.cancelButtonText = 'Close';
      modalOptions.title = 'Complete';
    }

    return modalOptions;
  };
  return [
    {
      Component: (
        <Link
          className="button button--green button--add button--small form-group__element"
          to={(location) => ({
            pathname: '/collections/add',
            search: getPersistentQueryParams(location),
          })}
          role="button"
        >
          {strings.add_collection}
        </Link>
      ),
    },
    {
      text: 'Delete Collection(s)',
      action: (collectionId) => {
        const { name, version } = collectionNameVersion(collectionId);
        return deleteCollection(name, version);
      },
      state: collections.deleted,
      confirm: confirmDelete,
      className: 'button button--delete button--small form-group__element',
      getModalOptions
    }
  ];
};
