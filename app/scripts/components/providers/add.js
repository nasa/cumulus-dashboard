'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getSchema, createProvider } from '../../actions';
import ErrorReport from '../errors/report';
import Schema from '../form/schema';
import Loading from '../app/loading-indicator';

const SCHEMA_KEY = 'provider';

var AddProvider = React.createClass({
  getInitialState: function () {
    return {
      providerId: null
    };
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    router: React.PropTypes.object,
    providers: React.PropTypes.object,
    schema: React.PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(getSchema(SCHEMA_KEY));
  },

  post: function (id, payload) {
    payload.createdAt = new Date().getTime();
    payload.updatedAt = new Date().getTime();
    payload.changedBy = 'Cumulus Dashboard';
    if (payload.name) {
      let { dispatch } = this.props;
      this.setState({
        name: payload.name
      }, () => dispatch(createProvider(payload)));
    }
  },

  render: function () {
    const { providerId } = this.state;
    const record = providerId
      ? get(this.props.providers.created, providerId, {}) : {};
    const schema = this.props.schema[SCHEMA_KEY];
    return (
      <div className='page__component page__content--shortened--centered'>
        <section className='page__section page__section--fullpage-form'>
          <div className='page__section__header'>
            <h1 className='heading--large'>Add a Provider</h1>
            <p className='description'>Create a provider</p>
          </div>
          {schema ? <Schema
            schema={schema}
            pk={'new-provider'}
            onSubmit={this.post}
            router={this.props.router}
          /> : null}
          {record.status === 'inflight' ? <Loading /> : null}
          {record.status === 'error' ? <ErrorReport report={record.error} /> : null}
        </section>
      </div>
    );
  }
});

export default connect(state => state)(AddProvider);
