'use strict';
import React from 'react';
import Collapse from 'react-collapsible';

import { fullDate } from '../format';

export const tableColumns = [
  {
    Header: 'Id',
    accessor: row => row['id'],
    id: 'id'
  },
  {
    Header: 'Type',
    accessor: 'type'
  },
  {
    Header: 'Timestamp',
    accessor: row => fullDate(row['timestamp']),
    id: 'timestamp'
  },
  {
    Header: 'Input Details',
    accessor: row => (
      <Collapse trigger={'More Details'} triggerWhenOpen={'Less Details'}>
        <pre className={'pre-style'}>{JSON.stringify(row.eventDetails, null, 2)}</pre>
      </Collapse>
    ),
    id: 'eventDetails'
  }
];
