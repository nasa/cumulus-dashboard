'use strict';

import test from 'ava';
import { render } from '@testing-library/react'
import React from 'react';

import TableFilters from '../../../app/src/js/components/Table/TableFilters';

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
  const { container } = render(
    <TableFilters columns={columns} />
  );

  const filters = container.querySelectorAll('.table__filters--filter');
  console.log(filters);

  t.is(filters.length, 4);

  filters.forEach(node => {
    const input = node.querySelector('input');
    t.is(input.checked, true);
  });
});

test('Renders table filters with hidden columns unchecked', t => {
  const { container } = render(
    <TableFilters
      columns={columns}
      hiddenColumns={['title', 'startDate']}
    />
  );

  const filters = container.querySelectorAll('.table__filters--filter');

  t.is(filters.length, 4);

  t.is(filters[0].querySelector('input#chk_name').checked, true);
  t.is(filters[1].querySelector('input#chk_title').checked, false);
  t.is(filters[2].querySelector('input#chk_company').checked, true);
  t.is(filters[3].querySelector('input#chk_startDate').checked, false);
});
