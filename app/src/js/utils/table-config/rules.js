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
  text: 'Enable',
  action: (ruleName) =>
    enableRule(rules.list.data.find((rule) => rule.name === ruleName)),
  state: rules.enabled,
  confirm: (d) => `Enable ${d} Rule(s)?`
}, {
  text: 'Disable',
  action: (ruleName) =>
    disableRule(rules.list.data.find((rule) => rule.name === ruleName)),
  state: rules.disabled,
  confirm: (d) => `Disable ${d} Rule(s)?`
}, {
  text: 'Delete',
  action: deleteRule,
  state: rules.deleted,
  confirm: (d) => `Delete ${d} Rule(s)?`
}];
