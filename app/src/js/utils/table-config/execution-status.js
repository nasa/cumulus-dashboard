import React from 'react';
import Collapse from 'react-collapsible';

import { fullDate } from '../format';

export const tableColumns = [
  {
    Header: 'Id',
    accessor: 'id',
  },
  {
    Header: 'Type',
    accessor: 'type'
  },
  {
    Header: 'Timestamp',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fullDate(value)
  },
  {
    Header: 'Input Details',
    accessor: 'eventDetails',
    Cell: ({ cell: { value } }) => ( // eslint-disable-line react/prop-types
      <Collapse trigger={'More Details'} triggerWhenOpen={'Less Details'}>
        <pre className={'pre-style'}>{JSON.stringify(value, null, 2)}</pre>
      </Collapse>
    ),
  }
];

export default tableColumns;
