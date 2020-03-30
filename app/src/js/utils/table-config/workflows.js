import React from 'react';
import { Link } from 'react-router-dom';

export const makeSteps = (row) => {
  try {
    return Object.keys(row.definition.States).join(', ');
  } catch (error) {
    return '';
  }
};

export const tableColumns = [
  {
    Header: 'Name',
    accessor: row => <Link to={`/workflows/workflow/${row.name}`}>{row.name}</Link>,
    id: 'name'
  },
  {
    Header: 'AWS Link',
    accessor: 'definition.Comment',
    id: 'template'
  },
  {
    Header: 'Steps',
    accessor: makeSteps,
    id: 'steps'
  }
];
