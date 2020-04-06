import React from 'react';
import { Link } from 'react-router-dom';
import { awsRegion } from '../../config';

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
    accessor: (row) => <Link to={`/workflows/workflow/${row.name}`}>{row.name}</Link>,
    id: 'name'
  },
  {
    Header: 'AWS Step Function',
    accessor: buildLink,
    id: 'template'
  },
  {
    Header: 'Steps',
    accessor: makeSteps,
    id: 'steps'
  }
];
