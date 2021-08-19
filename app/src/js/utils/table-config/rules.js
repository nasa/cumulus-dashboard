import React from 'react';
import { Link } from 'react-router-dom';
import {
  enableRule,
  disableRule,
  deleteRule
} from '../../actions';
import {
  getFormattedCollectionId,
  collectionLink,
  providerLink,
  fromNowWithTooltip,
  enableRules,
  disableRules,
  deleteRules,
} from '../format';
import { strings } from '../../components/locale';
import { getPersistentQueryParams } from '../url-helper';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ cell: { value } }) => <Link to={(location) => ({ pathname: `/rules/rule/${value}`, search: getPersistentQueryParams(location) })}>{value}</Link> // eslint-disable-line react/prop-types
  },
  {
    Header: 'Provider',
    accessor: 'provider',
    Cell: ({ cell: { value } }) => providerLink(value)
  },
  {
    Header: strings.collection_id,
    accessor: 'collection',
    Cell: ({ cell: { value } }) => collectionLink(getFormattedCollectionId(value)),
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
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'timestamp'
  }
];

const removeEsFields = (data) => {
  const { queriedAt, timestamp, stats, ...nonEsFields } = data;
  return nonEsFields;
};

export const bulkActions = (rules) => [{
  text: 'Enable Rule',
  action: (ruleName) => {
    const rule = rules.list.data.find((ruleData) => ruleData.name === ruleName);
    const filteredRule = removeEsFields(rule);
    return enableRule(filteredRule);
  },
  state: rules.enabled,
  confirm: (d) => enableRules(d),
  className: 'button button--green button--enable button--small form-group__element'
}, {
  text: 'Disable Rule',
  action: (ruleName) => {
    const rule = rules.list.data.find((ruleData) => ruleData.name === ruleName);
    const filteredRule = removeEsFields(rule);
    return disableRule(filteredRule);
  },
  state: rules.disabled,
  confirm: (d) => disableRules(d),
  className: 'button button--green button--disable button--small form-group__element'
},
{
  Component: <Link className='button button--green button--add button--small form-group__element' to={(location) => ({ pathname: '/rules/add', search: getPersistentQueryParams(location) })}>Add Rule</Link>
},
{
  text: 'Delete Rule',
  action: deleteRule,
  state: rules.deleted,
  confirm: (d) => deleteRules(d),
  className: 'button button--delete button--small form-group__element'
}];
