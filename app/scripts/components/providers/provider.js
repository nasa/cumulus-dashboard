'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  interval,
  getProvider,
  deleteProvider,
  restartProvider,
  stopProvider,
  listCollections
} from '../../actions';
import { get } from 'object-path';
import { fullDate, lastUpdated, deleteText } from '../../utils/format';
import Loading from '../app/loading-indicator';
import LogViewer from '../logs/viewer';
import AsyncCommands from '../form/dropdown-async-command';
import ErrorReport from '../errors/report';
import Metadata from '../table/metadata';
import { updateInterval } from '../../config';

const metaAccessors = [
  ['PDR Name', 'name'],
  ['Protocol', 'protocol'],
  ['Created', 'createdAt', fullDate],
  ['Last Time Ingested', 'lastTimeIngestedAt', fullDate],
  ['Host', 'host'],
  ['Path', 'path']
];

var ProviderOverview = React.createClass({
  displayName: 'Provider',

  propTypes: {
    params: PropTypes.object,
    dispatch: PropTypes.func,
    providers: PropTypes.object,
    collections: PropTypes.object,
    logs: PropTypes.object,
    router: PropTypes.object
  },

  componentWillMount: function () {
    const { providerId } = this.props.params;
    const immediate = !this.props.providers.map[providerId];
    this.reload(immediate);
    this.props.dispatch(listCollections({
      limit: 100,
      fields: 'collectionName',
      providers: providerId
    }));
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  reload: function (immediate, timeout) {
    timeout = timeout || updateInterval;
    const providerId = this.props.params.providerId;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getProvider(providerId)), timeout, immediate);
  },

  navigateBack: function () {
    const { router } = this.props;
    router.push('/providers');
  },

  delete: function () {
    const { providerId } = this.props.params;
    const provider = this.props.providers.map[providerId].data;
    if (!provider.published) {
      this.props.dispatch(deleteProvider(providerId));
    }
  },

  restart: function () {
    const { providerId } = this.props.params;
    this.props.dispatch(restartProvider(providerId));
  },

  stop: function () {
    const { providerId } = this.props.params;
    this.props.dispatch(stopProvider(providerId));
  },

  errors: function () {
    const providerId = this.props.params.providerId;
    return [
      get(this.props.providers.map, [providerId, 'error']),
      get(this.props.providers.deleted, [providerId, 'error'])
    ].filter(Boolean);
  },

  render: function () {
    const providerId = this.props.params.providerId;
    const record = this.props.providers.map[providerId];

    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }
    const provider = record.data;
    const associatedCollections = get(this.props.collections, ['list', 'data'], [])
      .map(c => c.collectionName);
    const logsQuery = { 'meta.provider': providerId };
    const errors = this.errors();

    const deleteStatus = get(this.props.providers.deleted, [providerId, 'status']);
    const restartStatus = get(this.props.providers.restarted, [providerId, 'status']);
    const stopStatus = get(this.props.providers.stopped, [providerId, 'status']);
    const dropdownConfig = [{
      text: 'Stop',
      action: this.stop,
      disabled: provider.status === 'stopped',
      status: stopStatus,
      success: () => this.reload(true)
    }, {
      text: 'Restart',
      action: this.restart,
      status: restartStatus,
      success: () => this.reload(true)
    }, {
      text: 'Delete',
      action: this.delete,
      disabled: provider.published,
      status: deleteStatus,
      success: this.navigateBack,
      confirmAction: true,
      confirmText: deleteText(providerId)
    }];

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{providerId}</h1>
          <AsyncCommands config={dropdownConfig} />
          <Link
            className='button button--small button--green form-group__element--right'
            to={'/providers/edit/' + providerId}>Edit</Link>

          {lastUpdated(provider.queriedAt)}
        </section>

        <section className='page__section'>
          {errors.length ? <ErrorReport report={errors} /> : null}
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Provider Overview</h2>
          </div>
          <Metadata data={provider} accessors={metaAccessors} />
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>Associated Collections</h2>
          </div>
          <ul>
            {associatedCollections.map(c => (<li key={c} className='metadata__provider__collections'><a href={'#/collections/collection/' + c}>{c}</a></li>))}
          </ul>
        </section>

        <section className='page__section'>
          <LogViewer
            query={logsQuery}
            dispatch={this.props.dispatch}
            logs={this.props.logs}
            notFound={`No recent logs for ${providerId}`}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  providers: state.providers,
  collections: state.collections,
  logs: state.logs
}))(ProviderOverview);
