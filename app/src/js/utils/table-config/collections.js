'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { Link } from 'react-router-dom';
import { fromNow, seconds, tally, collectionNameVersion } from '../format';
import { deleteCollection } from '../../actions';
import { strings } from '../../components/locale';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: row => <Link to={`/collections/collection/${row.name}/${row.version}`}>{row.name}</Link>,
    id: 'name',
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
    accessor: row => row.mmtLink ? <a href={row.mmtLink} target="_blank">MMT</a> : null,
    id: 'mmtLink',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Duration',
    accessor: row => seconds(row.duration),
    id: 'duration'
  },
  {
    Header: 'Timestamp',
    accessor: row => fromNow(row.timestamp),
    id: 'timestamp'
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

const DeleteModalContent = ({selectionsWithGranules}) => {
  return (
    <>
      <span>
        You have submitted a request to delete multiple collections.
        The following collections contain associated granules:
      </span>
      <ul className='collections-with-granules'>
        {selectionsWithGranules.map((collection, index) => {
          const {name, version} = collectionNameVersion(collection);
          return (
            <li className='collection-with-granules' key={index}>{`${name} / ${version}`}</li>
          );
        })}
      </ul>
      <span>
        In order to complete this request, the granules associated with the above collections must first be deleted.
        Would you like to be redirected to the Granules pages?
      </span>
    </>
  );
};

DeleteModalContent.propTypes = {
  selectionsWithGranules: PropTypes.array
};

export const bulkActions = function (collections) {
  const getModalOptions = (selections, history) => {
    let modalOptions = {};

    const selectionsWithGranules = selections.filter(selection => {
      const { name, version } = collectionNameVersion(selection);
      const collectionItem = collections.list.data.find(item => item.name === name && item.version === version);
      return get(collectionItem, 'stats.total', 0) > 0;
    });

    if (selectionsWithGranules.length > 0) {
      modalOptions.confirmButtonText = 'Go To Granules';
      modalOptions.cancelButtonText = 'Cancel Request';
      modalOptions.onConfirm = () => {
        history.push('/granules');
      };
      modalOptions.children = <DeleteModalContent selectionsWithGranules={selectionsWithGranules} />;
    }

    return modalOptions;
  };
  return [
    {
      Component: <Link className='button button--green button--add button--small form-group__element' to='/collections/add' role="button">{strings.add_collection}</Link>
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
