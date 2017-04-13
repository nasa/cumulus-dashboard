'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getSchema, createCollection } from '../../actions';
import Schema from '../form/schema';
import Loading from '../app/loading-indicator';

const SCHEMA_KEY = 'collection';

var AddCollection = React.createClass({
  getInitialState: function () {
    return {
      collectionName: null
    };
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    router: React.PropTypes.object,
    collections: React.PropTypes.object,
    schema: React.PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(getSchema(SCHEMA_KEY));
  },

  componentWillReceiveProps: function (newProps) {
    const status = get(newProps, ['collections', 'created', this.state.collectionName, 'status']);
    if (status === 'success') {
      this.props.router.push(`/collections/collection/${this.state.collectionName}`);
    }
  },

  post: function (id, payload) {
    payload.createdAt = new Date().getTime();
    payload.updatedAt = new Date().getTime();
    payload.changedBy = 'Cumulus Dashboard';
    if (payload.collectionName) {
      let { dispatch } = this.props;
      this.setState({
        collectionName: payload.collectionName
      }, () => dispatch(createCollection(payload)));
    }
  },

  render: function () {
    const { collectionName } = this.state;
    const record = collectionName
      ? get(this.props.collections.created, collectionName, {}) : {};
    const schema = this.props.schema[SCHEMA_KEY];
    return (
      <div className='page__component page__content--shortened--centered'>
        <section className='page__section page__section--fullpage-form'>
          <div className='page__section__header'>
            <h1 className='heading--large'>Add a Collection</h1>
            <p className='description'>Create a collection</p>
          </div>
          {schema ? <Schema
            schema={schema}
            pk={'new-collection'}
            onSubmit={this.post}
            router={this.props.router}
            status={record.status}
            error={record.status === 'inflight' ? null : record.error}
          /> : <Loading />}
        </section>
      </div>
    );
  }
});

export default connect(state => state)(AddCollection);
