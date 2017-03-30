'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getProvider, updateProvider, getSchema } from '../../actions';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import Schema from '../form/schema';
import merge from '../../utils/merge';

const SCHEMA_KEY = 'provider';

var EditProvider = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
    providers: React.PropTypes.object,
    schema: React.PropTypes.object,
    router: React.PropTypes.func,
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      providerId: null,
      error: null
    };
  },

  get: function (providerId) {
    const record = this.props.providers.map[providerId];
    if (!record) {
      this.props.dispatch(getProvider(providerId));
    }
  },

  componentWillMount: function () {
    const providerId = this.props.params.providerId;
    if (providerId) {
      this.get(providerId);
    }
    this.props.dispatch(getSchema(SCHEMA_KEY));
  },

  componentWillReceiveProps: function (newProps) {
    const providerId = newProps.params.providerId;
    if (this.state.providerId === providerId) { return; }

    const record = get(this.props.providers.map, providerId, {});

    // record has hit an API error
    if (record.error) {
      this.setState({
        providerId,
        error: record.error
      });
    } else if (record.data) {
      // record has hit an API success; update the UI
      this.setState({
        providerId,
        error: null
      });
    } else if (!record.inflight) {
      // we've not yet fetched the record, request it
      this.get(providerId);
    }
  },

  onSubmit: function (id, payload) {
    const providerId = this.props.params.providerId;
    const record = this.props.providers.map[providerId];
    const json = merge(record.data, payload);
    this.setState({ error: null });
    json.updatedAt = new Date().getTime();
    json.changedBy = 'Cumulus Dashboard';
    this.props.dispatch(updateProvider(json));
  },

  render: function () {
    const providerId = this.props.params.providerId;
    const record = get(this.props.providers.map, [providerId], {});
    const meta = get(this.props.providers.updated, [providerId], {});
    const error = this.state.error || record.error || meta.error;
    const schema = this.props.schema[SCHEMA_KEY];
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Edit {providerId}</h1>
          {schema && record.data ? (
            <Schema
              schema={schema}
              data={record.data}
              pk={providerId}
              onSubmit={this.onSubmit}
              router={this.props.router}
            />
          ) : null}
          {record.inflight || meta.status === 'inflight' ? <Loading /> : null}
          {error ? <ErrorReport report={error} /> : null}
          {meta.status === 'success' ? <p>Success!</p> : null}
        </section>
      </div>
    );
  }
});

export default connect(state => state)(EditProvider);
