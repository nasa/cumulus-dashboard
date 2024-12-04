import React from 'react';
import { awsRegion } from '../../config';
import { getPersistentQueryParams } from '../../withUrlHelper';

export const makeSteps = (row) => {
  try {
    return Object.keys(row.definition.States).join(', ');
  } catch (error) {
    return '';
  }
};

export const buildLink = (r) => {
  const descriptionExists = r.definition && r.definition.Comment;
  const description = (r.definition && r.definition.Comment) || 'AWS Stepfunction';
  const href = r.arn ? `https://console.aws.amazon.com/states/home?region=${awsRegion}#/statemachines/view/${r.arn}` : null;
  if (href) return <a target='_blank' href={href}>{description}</a>;
  if (descriptionExists) return description;
  return null;
};

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    isLink: true,
    linkTo: (row) => {
      const queryParams = getPersistentQueryParams(window.location);
      const path = `/workflows/workflow/${row.name}`;
      return queryParams ? `${path}?${queryParams}` : path;
    },
    Cell: ({ cell: { value } }) => (value)
  },
  {
    Header: 'AWS Step Function',
    accessor: (row) => (row.definition && row.definition.Comment) || 'AWS Stepfunction',
    Cell: ({ row }) => buildLink(row.original),
  },
  {
    Header: 'Steps',
    accessor: makeSteps,
    id: 'steps'
  }
];
