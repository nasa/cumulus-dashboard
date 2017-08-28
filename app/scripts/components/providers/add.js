'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getSchema, createProvider } from '../../actions';
import Schema from '../form/schema';
import Loading from '../app/loading-indicator';

const SCHEMA_KEY = 'provider';

var AddProvider = React.createClass({
  getInitialState: function () {
    return {
      name: null
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

  componentWillReceiveProps: function (newProps) {
    const status = get(newProps, ['providers', 'created', this.state.name, 'status']);
    if (status === 'success') {
      this.props.router.push(`/providers/provider/${this.state.name}`);
    }
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
    const { name } = this.state;
    const record = name
      ? get(this.props.providers.created, name, {}) : {};
    const schema = this.props.schema[SCHEMA_KEY];
    return (
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
          status={record.status}
          error={record.status === 'inflight' ? null : record.error}
        /> : <Loading />}
      </section>
    );
  }
});

export default connect(state => state)(AddProvider);
