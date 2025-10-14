import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { get } from 'object-path';
import {
  displayCase,
  providerLink,
  fullDate,
  lastUpdated,
  enableConfirm,
  disableConfirm,
  enableText,
  disableText,
  deleteText,
  rerunText,
} from '../../utils/format';
import {
  getRule,
  deleteRule,
  rerunRule,
  enableRule,
  disableRule
} from '../../actions';
import Loading from '../LoadingIndicator/loading-indicator';
import Metadata from '../Table/Metadata';
import DropdownAsync from '../DropDown/dropdown-async-command';
import ErrorReport from '../Errors/report';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { getPersistentQueryParams, historyPushWithQueryParams } from '../../utils/url-helper';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/'
  },
  {
    label: 'Rules',
    href: '/rules'
  },
  {
    label: 'Rule Overview',
    active: true
  }
];

const metaAccessors = [
  { label: 'Rule Name', property: 'name' },
  { label: 'Timestamp', property: 'updatedAt', accessor: fullDate },
  { label: 'Workflow', property: 'workflow' },
  { label: 'Provider', property: 'provider', accessor: providerLink },
  { label: 'Provider Path', property: 'provider_path' },
  { label: 'Rule Type', property: 'rule.type' },
  // PGC { label: 'Collection', property: 'collection', accessor: d => collectionLink(getCollectionId(d)) },
];

const Rule = () => {
  const dispatch = useDispatch();
  const { ruleName } = useParams();

  const load = useCallback((name) => {
    dispatch(getRule(name));
  }, [dispatch]);

  useEffect(() => {
    if (ruleName) {
      load(ruleName);
    }
  }, [ruleName, load]);

  const rules = useSelector((state) => state.rules);

  const navigateBack = useCallback(() => {
    historyPushWithQueryParams('/rules');
  }, []);

  const reload = useCallback(() => {
    load(ruleName);
  }, [ruleName, load]);

  const remove = useCallback(() => {
    dispatch(deleteRule(ruleName));
  }, [ruleName, dispatch]);

  const enable = useCallback(() => {
    const ruleData = get(rules.map, [ruleName, 'data']);
    if (ruleData) {
      dispatch(enableRule(ruleData));
    }
  }, [ruleName, rules.map, dispatch]);

  const disable = useCallback(() => {
    const ruleData = get(rules.map, [ruleName, 'data']);
    if (ruleData) {
      dispatch(disableRule(ruleData));
    }
  }, [ruleName, rules.map, dispatch]);

  const rerun = useCallback(() => {
    const ruleData = get(rules.map, [ruleName, 'data']);
    if (ruleData) {
      dispatch(rerunRule(ruleData));
    }
  }, [ruleName, rules.map, dispatch]);

  const errors = useMemo(
    () => (
      [
        get(rules.map, [ruleName, 'error']),
        get(rules.deleted, [ruleName, 'error']),
        get(rules.enabled, [ruleName, 'error']),
        get(rules.disabled, [ruleName, 'error']),
        get(rules.rerun, [ruleName, 'error'])
      ].filter(Boolean)
    ),
    [ruleName, rules]
  );

  const record = rules.map[ruleName];

  if (!record || (record.inflight && !record.data)) {
    return <Loading />;
  }

  const data = get(record, 'data', {});

  const deleteStatus = get(rules, `deleted.${ruleName}.status`);
  const enabledStatus = get(rules, `enabled.${ruleName}.status`);
  const disabledStatus = get(rules, `disabled.${ruleName}.status`);
  const rerunStatus = get(rules, `rerun.${ruleName}.status`);

  const dropdownConfig = [{
    text: 'Enable',
    action: enable,
    disabled: data.type === 'onetime',
    status: enabledStatus,
    confirmAction: true,
    confirmText: enableText(ruleName),
    postActionModal: true,
    postActionText: enableConfirm(ruleName),
    success: reload
  }, {
    text: 'Disable',
    action: disable,
    disabled: data.type === 'onetime',
    status: disabledStatus,
    confirmAction: true,
    postActionModal: true,
    confirmText: disableText(ruleName),
    postActionText: disableConfirm(ruleName),
    success: reload
  }, {
    text: 'Delete',
    action: remove,
    status: deleteStatus,
    success: navigateBack,
    confirmAction: true,
    confirmText: deleteText(ruleName)
  }, {
    text: 'Rerun',
    action: rerun,
    status: rerunStatus,
    success: reload,
    confirmAction: true,
    confirmText: rerunText(ruleName)
  }];

  return (
    <div className='page__component'>
      <section className='page__section page__section__controls'>
        <div className="options--top">
          <Breadcrumbs config={breadcrumbConfig} />
        </div>
      </section>
      <hr />
      <section className='page__section page__section__header-wrapper'>
        <div className='page__section__header'>
          <h1 className='heading--large heading--shared-content with-description'>Rule: {ruleName}</h1>
          <DropdownAsync config={dropdownConfig}/>

          <Link
            className='button button--copy button--small button--green form-group__element--right'
            to={(location) => ({
              pathname: '/rules/add',
              search: getPersistentQueryParams(location),
              state: {
                name: ruleName
              }
            })}>Copy Rule</Link>
          <Link
            className='button button--edit button--small button--green form-group__element--right'
            to={(location) => ({ pathname: `/rules/edit/${ruleName}`, search: getPersistentQueryParams(location) })}>Edit Rule</Link>
          {lastUpdated(data.timestamp || data.updatedAt)}
        </div>
      </section>
      <hr />
      <section className='page__section'>
        {errors.length > 0 && <ErrorReport report={errors} />}
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium with-description'>Rule Overview</h2>
        </div>
        <div className="rule__state">
          {data.state && (
            <dl className='status--process'>
              <dt>State:</dt>
              <dd className={`status__badge status__badge--${data.state.toLowerCase()}`}>{displayCase(data.state)}</dd>
            </dl>
          )}
        </div>
        <div className="rule__content">
          <Metadata data={data} accessors={metaAccessors} />
        </div>
      </section>
    </div>
  );
};

export default Rule;
