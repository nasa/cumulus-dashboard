import React, { useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import {
  enableRule,
  disableRule,
  deleteRule,
  listRules,
  searchRules,
  clearRulesSearch,
  filterRules,
  clearRulesFilter,
} from '../../actions';
import {
  lastUpdated,
  tally,
  enableRules,
  disableRules,
  deleteRules
} from '../../utils/format';
import List from '../Table/Table';
import Search from '../Search/search';
import { tableColumns } from '../../utils/table-config/rules';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { withUrlHelper } from '../../withUrlHelper';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Rules',
    active: true,
  },
];

const RulesOverview = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { queryParams, getPersistentQueryParams } = urlHelper;

  const rules = useSelector((state) => state.rules);
  const { list } = rules || {};
  const { count, queriedAt } = list?.meta || {};

  const removeEsFields = (data) => {
    const { queriedAt: _, timestamp, stats, ...nonEsFields } = data;
    return nonEsFields;
  };

  useEffect(() => {
    dispatch(listRules());
  }, [dispatch]);

  const generateBulkActions = useCallback(() => {
    if (!rules || !rules.list || !rules.list.data) {
      return [];
    }

    const rulesOps = {
      list: rules.list,
      enabled: rules.enabled || {},
      disabled: rules.disabled || {},
      deleted: rules.deleted || {}
    };

    return [
      {
        text: 'Enable Rule',
        action: (ruleName) => {
          const rule = rules.list.data.find((ruleData) => ruleData.name === ruleName);
          const filteredRule = removeEsFields(rule);
          return enableRule(filteredRule);
        },
        state: rulesOps.enabled,
        confirm: (d) => enableRules(d),
        className: 'button button--green button--enable button--small form-group__element'
      }, {
        text: 'Disable Rule',
        action: (ruleName) => {
          const rule = rules.list.data.find((ruleData) => ruleData.name === ruleName);
          const filteredRule = removeEsFields(rule);
          return disableRule(filteredRule);
        },
        state: rulesOps.disabled,
        confirm: (d) => disableRules(d),
        className: 'button button--green button--disable button--small form-group__element'
      },
      {
        Component: <Link className='button button--green button--add button--small form-group__element' to={{ pathname: '/rules/add', search: getPersistentQueryParams(location) }}>Add Rule</Link>
      },
      {
        text: 'Delete Rule',
        action: deleteRule,
        state: rulesOps.deleted,
        confirm: (d) => deleteRules(d),
        className: 'button button--delete button--small form-group__element'
      }
    ];
  }, [rules, location, getPersistentQueryParams]);

  return (
    <div className="page__component">
      <Helmet>
        <title> Rules Overview </title>
      </Helmet>
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="page__section__header">
          <h1 className="heading--large heading--shared-content with-description">
            Rules Overview
          </h1>
          {lastUpdated(queriedAt)}
        </div>
      </section>
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            All Rules
            <span className="num-title">
              {count ? ` ${tally(count)}` : 0}
            </span>
          </h2>
        </div>

        <List
          list={list}
          action={listRules}
          tableColumns={tableColumns}
          query={queryParams}
          initialSortId="updatedAt"
          bulkActions={generateBulkActions()}
          rowId="name"
          filterAction={filterRules}
          filterClear={clearRulesFilter}
          tableId="rules"
        >
          <Search
            action={searchRules}
            clear={clearRulesSearch}
            label="Search"
            labelKey="name"
            placeholder="Rule"
            searchKey="rules"
          />
        </List>
      </section>
    </div>
  );
};

RulesOverview.propTypes = {
  urlHelper: PropTypes.shape({
    queryParams: PropTypes.object,
    getPersistentQueryParams: PropTypes.func
  }),
};

export default withUrlHelper(RulesOverview);
