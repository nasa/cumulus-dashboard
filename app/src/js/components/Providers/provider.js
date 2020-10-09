import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'object-path';
import {
  getProvider,
  deleteProvider,
  listCollections
} from '../../actions';
import {
  fromNow,
  lastUpdated,
  deleteText,
  link,
  tally
} from '../../utils/format';
import Loading from '../LoadingIndicator/loading-indicator';
import LogViewer from '../Logs/viewer';
import DropdownAsync from '../DropDown/dropdown-async-command';
import ErrorReport from '../Errors/report';
import Metadata from '../Table/Metadata';
import { getPersistentQueryParams, historyPushWithQueryParams } from '../../utils/url-helper';

const metaAccessors = [
  {
    label: 'Created',
    property: 'createdAt',
    accessor: fromNow
  },
  {
    label: 'Updated',
    property: 'updatedAt',
    accessor: fromNow
  },
  {
    label: 'Protocol',
    property: 'protocol'
  },
  {
    label: 'Host',
    property: 'host',
    accessor: link
  },
  {
    label: 'Global Connection Limit',
    property: 'globalConnectionLimit',
    accessor: tally
  }
];

class ProviderOverview extends React.Component {
  constructor () {
    super();
    this.loadProvider = this.loadProvider.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.delete = this.delete.bind(this);
    this.errors = this.errors.bind(this);
  }

  componentDidMount () {
    const { providerId } = this.props.match.params;
    this.loadProvider();
    this.props.dispatch(listCollections({
      limit: 100,
      fields: 'collectionName',
      providers: providerId
    }));
  }

  loadProvider () {
    const { providerId } = this.props.match.params;
    this.props.dispatch(getProvider(providerId));
  }

  navigateBack () {
    historyPushWithQueryParams('/providers');
  }

  delete () {
    const { providerId } = this.props.match.params;
    const provider = this.props.providers.map[providerId].data;
    if (!provider.published) {
      this.props.dispatch(deleteProvider(providerId));
    }
  }

  errors () {
    const { providerId } = this.props.match.params;
    return [
      get(this.props.providers.map, [providerId, 'error']),
      get(this.props.providers.deleted, [providerId, 'error'])
    ].filter(Boolean);
  }

  render () {
    const { providerId } = this.props.match.params;
    const record = this.props.providers.map[providerId];

    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }

    if (record.error) {
      return <ErrorReport report={record.error} truncate={true} />;
    }
    const provider = record.data;
    const logsQuery = { 'meta.provider': providerId };
    const errors = this.errors();

    const deleteStatus = get(this.props.providers.deleted, [providerId, 'status']);
    const dropdownConfig = [{
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
          <h1 className='heading--large heading--shared-content with-description'>Provider: {providerId}</h1>
          <DropdownAsync config={dropdownConfig} />
          <Link
            className='button button--small button--green button--edit form-group__element--right'
            to={(location) => ({ pathname: `/providers/edit/${providerId}`, search: getPersistentQueryParams(location) })}>Edit</Link>
          {lastUpdated(provider.timestamp || provider.updatedAt)}
        </section>

        <section className='page__section'>
          {errors.length ? <ErrorReport report={errors} truncate={true} /> : null}
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Provider Overview</h2>
          </div>
          <Metadata data={provider} accessors={metaAccessors} />
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
}

ProviderOverview.propTypes = {
  match: PropTypes.object,
  dispatch: PropTypes.func,
  providers: PropTypes.object,
  logs: PropTypes.object,
};

ProviderOverview.displayName = 'ProviderElem';

export default withRouter(
  connect((state) => ({
    providers: state.providers,
    logs: state.logs
  }))(ProviderOverview)
);
