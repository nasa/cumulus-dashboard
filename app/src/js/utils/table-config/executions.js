import React from 'react';
// import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import cloneDeep from 'lodash/cloneDeep';
// import get from 'lodash/get';
import {
  displayCase,
  seconds,
  formatCollectionId,
  fullDate
} from '../format';
import { strings } from '../../components/locale';
// import { getPersistentQueryParams } from '../url-helper';
import { getEventDetails } from '../../components/Executions/execution-graph-utils';
import Tooltip from '../../components/Tooltip/tooltip';
import { getExecutionStatus } from '../../actions';
// import { getPersistentQueryParams } from '../../withUrlHelper';

export const formatEvents = (events) => {
  const mutableEvents = cloneDeep(events);
  if (mutableEvents) {
    mutableEvents.forEach((event, index, eventsArray) => {
      event.eventDetails = getEventDetails(event);
      if (index === 0 || event.name || !event.type.match('LambdaFunction')) return;
      const prevStep = eventsArray[index - 1];
      event.name = prevStep.name;
    });
  }
  return mutableEvents;
};

export const subColumns = [
  {
    Header: 'Event ID',
    accessor: 'id',
  },
  {
    Header: 'Step Name',
    accessor: 'name'
  },
  {
    Header: 'Event Type',
    accessor: 'type',
    // eslint-disable-next-line react/prop-types
    Cell: ({ cell: { value }, row: { original: { error } } }) => {
      const failed = !!error;
      const icon = failed ? faTimesCircle : faCheckCircle;
      const iconColor = failed ? 'red' : 'green';
      return (
        <>
          {value &&
            <div>
              {value} &nbsp;
              {!failed && <FontAwesomeIcon icon={icon} color={iconColor} />}
              {failed && <Tooltip
                className='tooltip--light'
                id={value}
                placement='right'
                target={<FontAwesomeIcon icon={icon} color={iconColor} />}
                tip={<div>{error}</div>}
              />}
            </div>}
        </>
      );
    }
  },
  {
    Header: 'Timestamp',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fullDate(value)
  },
];

export const tableColumns = ({ dispatch }) => ([
  {
    Header: 'Name',
    accessor: 'name',
    width: 150,
    isLink: true,
    linkTo: (row) => `/executions/execution/${row.arn}`,
    Cell: ({ cell: { value } }) => value
  },
  {
    Header: 'Progress',
    accessor: (row) => displayCase(row.status),
    id: 'status',
    // eslint-disable-next-line react/prop-types
    Cell: ({ cell: { value }, row: { original: { error } } }) => (
      <>{value} {value === 'Failed' && <Tooltip
        className='tooltip--light'
        id={value}
        placement='right'
        target={<FontAwesomeIcon icon={faTimesCircle} color='red' />}
        // eslint-disable-next-line react/prop-types
        tip={<div>{error.Error}</div>}
      />}</>
    )
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
    id: 'updatedAt'
  },
  {
    Header: 'Duration',
    accessor: (row) => seconds(row.duration),
    id: 'duration',
    width: 75
  },
  {
    Header: strings.collection_id,
    accessor: 'collectionId',
    width: 200,
    Cell: ({ cell: { value } }) => formatCollectionId(value)
  },
  {
    Header: 'Download Execution',
    id: 'download',
    accessor: (row) => row,
    // eslint-disable-next-line react/prop-types
    Cell: ({ row }) => {
      const handleDownloadClick = (e) => {
        e.preventDefault();
        // eslint-disable-next-line react/prop-types
        dispatch(getExecutionStatus(row.original.arn)).then((response) => {
          const url = response.data.presignedS3Url;
          if (url && window && !window.Cypress) window.open(url);
        });
      };

      return (
        <button
          aria-label={`Download Execution ${row.original.name}`} // eslint-disable-line react/prop-types
          className='button button__row button__row--download'
          onClick={handleDownloadClick}
        />
      );
    },
    disableSortBy: true
  }
]);

export default tableColumns;
