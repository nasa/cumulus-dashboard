'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  interval,
  getProvider,
  deleteProvider,
  restartProvider,
  stopProvider,
  listCollections,
  clearRestartedProvider,
  clearStoppedProvider
} from '../../actions';
import { get } from 'object-path';
import { fullDate, lastUpdated } from '../../utils/format';
import Loading from '../app/loading-indicator';
import LogViewer from '../logs/viewer';
import AsyncCommand from '../form/async-command';
import ErrorReport from '../errors/report';
import Metadata from '../table/metadata';
import { updateInterval, updateDelay } from '../../config';
import status from '../../utils/status';
import findkey from 'lodash.findkey';

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
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    providers: React.PropTypes.object,
    collections: React.PropTypes.object,
    logs: React.PropTypes.object,
    router: React.PropTypes.object
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
    const errors = [
      get(this.props.providers.map, [providerId, 'error']),
      get(this.props.providers.deleted, [providerId, 'error'])
    ].filter(Boolean);
    return errors.length ? errors.map(JSON.stringify).join(', ') : null;
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
    const deleteStatus = get(this.props.providers.deleted, [providerId, 'status']);
    const restartStatus = get(this.props.providers.restarted, [providerId, 'status']);
    const stopStatus = get(this.props.providers.stopped, [providerId, 'status']);
    const errors = this.errors();
    const providerError = provider.error;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{providerId}</h1>

          <AsyncCommand action={this.delete}
            success={this.navigateBack}
            status={deleteStatus}
            disabled={provider.published}
            className={'form-group__element--right'}
            text={deleteStatus === 'success' ? 'Deleted!' : 'Delete'}
            successTimeout={updateDelay} />
          <Link
            className='button button--small button--green form-group__element--right'
            to={'/providers/edit/' + providerId}
          >
            Edit
          </Link>
          <AsyncCommand
            action={this.restart}
            success={() => this.props.dispatch(clearRestartedProvider(this.props.params.providerId))}
            status={restartStatus}
            disabled={restartStatus === 'success'}
            className={'form-group__element--right'}
            text={restartStatus === 'success' ? 'Restarted!' : 'Restart'}
            successTimeout={updateDelay} />
          <AsyncCommand
            action={this.stop}
            success={() => this.props.dispatch(clearStoppedProvider(this.props.params.providerId))}
            status={stopStatus}
            disabled={stopStatus === 'success' || provider.status === 'stopped'}
            className={'form-group__element--right'}
            text={stopStatus === 'success' ? 'Stopped!' : 'Stop'}
            successTimeout={updateDelay} />

          {lastUpdated(provider.queriedAt)}
          Status: {findkey(status, v => v === provider.status)}
          {providerError ? <ErrorReport report={providerError} /> : null}
        </section>

        <section className='page__section'>
          {errors ? <ErrorReport report={errors} /> : null}
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
          <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(ProviderOverview);
