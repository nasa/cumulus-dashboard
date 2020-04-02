import React from 'react';
import { Link } from 'react-router-dom';
import {
  enableRule,
  disableRule,
  deleteRule
} from '../../actions';
import {
  getCollectionId,
  collectionLink,
  providerLink,
  fromNow
} from '../../utils/format';
import { strings } from '../../components/locale';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: row => <Link to={`/rules/rule/${row.name}`}>{row.name}</Link>,
    id: 'name'
  },
  {
    Header: 'Provider',
    accessor: row => providerLink(row.provider),
    id: 'provider'
  },
  {
    Header: strings.collection_id,
    accessor: row => collectionLink(getCollectionId(row.collection)),
    id: 'collectionId',
    disableSortBy: true
  },
  {
    Header: 'Type',
    accessor: 'rule.type',
    disableSortBy: true
  },
  {
    Header: 'State',
    accessor: 'state'
  },
  {
    Header: 'Timestamp',
    accessor: row => fromNow(row.timestamp),
    id: 'timestamp'
  }
];

export const bulkActions = (rules) => [{
  text: 'Enable Rule',
  action: (ruleName) =>
    enableRule(rules.list.data.find((rule) => rule.name === ruleName)),
  state: rules.enabled,
  confirm: (d) => `Enable ${d} Rule(s)?`,
  className: 'button button--green button--enable button--small form-group__element'
}, {
  text: 'Disable Rule',
  action: (ruleName) =>
    disableRule(rules.list.data.find((rule) => rule.name === ruleName)),
  state: rules.disabled,
  confirm: (d) => `Disable ${d} Rule(s)?`,
  className: 'button button--green button--disable button--small form-group__element'
},
{
  Component: <Link className='button button--green button--add button--small form-group__element' to='/rules/add'>Add Rule</Link>
},
{
  text: 'Delete Rule',
  action: deleteRule,
  state: rules.deleted,
  confirm: (d) => `Delete ${d} Rule(s)?`,
  className: 'button button--delete button--small form-group__element'
}];
