import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import cloneDeep from 'lodash/cloneDeep';
import {
  displayCase,
  seconds,
  fromNowWithTooltip,
  formatCollectionId,
  fullDate
} from '../format';
import { strings } from '../../components/locale';
import { getPersistentQueryParams } from '../url-helper';
import { getEventDetails } from '../../components/Executions/execution-graph-utils';
import Tooltip from '../../components/Tooltip/tooltip';

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
    Cell: ({ cell: { value }, row: { original: { eventDetails } } }) => {
      // eslint-disable-next-line react/prop-types
      const failed = eventDetails?.type === 'LambdaFunctionFailed';
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
                tip={<div>{JSON.stringify(eventDetails)}</div>}
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

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    width: 150,
    Cell: ({ row: { original: { arn, name } } }) => ( // eslint-disable-line react/prop-types
      <Link to={(location) => ({ pathname: `/executions/execution/${arn}`, search: getPersistentQueryParams(location) })} title={name}>{name}</Link>)
  },
  {
    Header: 'Progress',
    accessor: (row) => displayCase(row.status),
    id: 'status',
    // eslint-disable-next-line react/prop-types
    Cell: ({ cell: { value }, row: { original: { error } } }) => (
      <>{value}{value === 'Failed' && <Tooltip
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
    Header: 'Created',
    accessor: 'createdAt',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'createdAt'
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
  }
];

export default tableColumns;
