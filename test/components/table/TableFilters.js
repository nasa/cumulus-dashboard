'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';

import TableFilters from '../../../app/src/js/components/Table/TableFilters';

configure({ adapter: new Adapter() });

const columns = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Title',
    accessor: 'title'
  },
  {
    Header: 'Company',
    accessor: 'company',
  },
  {
    Header: 'Start Date',
    id: 'startDate',
    accessor: row => row.timestamp
  }
];

test('Renders table filters', t => {
  const wrapper = shallow(
    <TableFilters columns={columns} />
  );

  const filters = wrapper.find('.table__filters--filter');

  t.is(filters.length, 4);

  filters.forEach(node => {
    t.is(node.find('input').props().checked, true);
  });
});

test('Renders table filters with hidden columns unchecked', t => {
  const wrapper = shallow(
    <TableFilters
      columns={columns}
      hiddenColumns={['title', 'startDate']}
    />
  );

  const filters = wrapper.find('.table__filters--filter');

  t.is(filters.length, 4);

  t.is(filters.find('input#chk_name').props().checked, true);
  t.is(filters.find('input#chk_title').props().checked, false);
  t.is(filters.find('input#chk_company').props().checked, true);
  t.is(filters.find('input#chk_startDate').props().checked, false);
});
