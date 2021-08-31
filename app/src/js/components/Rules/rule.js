import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
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
  /* Why was this commented out? */
  // PGC { label: 'Collection', property: 'collection', accessor: d => collectionLink(getCollectionId(d)) },
];

class Rule extends React.Component {
  constructor () {
    super();
    this.load = this.load.bind(this);
    this.delete = this.delete.bind(this);
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
    this.rerun = this.rerun.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.reload = this.reload.bind(this);
    this.errors = this.errors.bind(this);
  }

  componentDidMount () {
    this.load(this.props.match.params.ruleName);
  }

  componentDidUpdate (prevProps) {
    if (this.props.match.params.ruleName !== prevProps.match.params.ruleName) {
      this.load(this.props.match.params.ruleName);
    }
  }

  load (ruleName) {
    this.props.dispatch(getRule(ruleName));
  }

  delete () {
    const { ruleName } = this.props.match.params;
    this.props.dispatch(deleteRule(ruleName));
  }

  enable () {
    const { ruleName } = this.props.match.params;
    this.props.dispatch(enableRule(this.props.rules.map[ruleName].data));
  }

  disable () {
    const { ruleName } = this.props.match.params;
    this.props.dispatch(disableRule(this.props.rules.map[ruleName].data));
  }

  rerun () {
    const { ruleName } = this.props.match.params;
    this.props.dispatch(rerunRule(this.props.rules.map[ruleName].data));
  }

  navigateBack () {
    historyPushWithQueryParams('/rules');
  }

  reload () {
    const { ruleName } = this.props.match.params;
    this.load(ruleName);
  }

  errors () {
    const { ruleName } = this.props.match.params;
    const { rules } = this.props;
    return [
      get(rules.map, [ruleName, 'error']),
      get(rules.deleted, [ruleName, 'error']),
      get(rules.enabled, [ruleName, 'error']),
      get(rules.disabled, [ruleName, 'error']),
      get(rules.rerun, [ruleName, 'error'])
    ].filter(Boolean);
  }

  render () {
    const { match: { params: { ruleName } }, rules } = this.props;
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
      action: this.enable,
      disabled: data.type === 'onetime',
      status: enabledStatus,
      confirmAction: true,
      confirmText: enableText(ruleName),
      postActionModal: true,
      postActionText: enableConfirm(ruleName),
      success: this.reload
    }, {
      text: 'Disable',
      action: this.disable,
      disabled: data.type === 'onetime',
      status: disabledStatus,
      confirmAction: true,
      postActionModal: true,
      confirmText: disableText(ruleName),
      postActionText: disableConfirm(ruleName),
      success: this.reload
    }, {
      text: 'Delete',
      action: this.delete,
      status: deleteStatus,
      success: this.navigateBack,
      confirmAction: true,
      confirmText: deleteText(ruleName)
    }, {
      text: 'Rerun',
      action: this.rerun,
      status: rerunStatus,
      success: this.reload,
      confirmAction: true,
      confirmText: rerunText(ruleName)
    }];

    const errors = this.errors();
    return (
      <div className='page__component'>
        <section className='page__section page__section__controls'>
          <div className="options--top">
            <Breadcrumbs config={breadcrumbConfig} />
          </div>
        </section>
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
  }
}

Rule.propTypes = {
  match: PropTypes.object,
  dispatch: PropTypes.func,
  rules: PropTypes.object
};

export default withRouter(connect((state) => ({
  rules: state.rules
}))(Rule));
