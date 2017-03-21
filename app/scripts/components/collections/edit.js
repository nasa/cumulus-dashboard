'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getCollection, updateCollection, getSchema } from '../../actions';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import Schema from '../form/schema';
import merge from '../../utils/merge';

const SCHEMA_KEY = 'collection';

var EditCollection = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
    collections: React.PropTypes.object,
    schema: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      collectionName: null,
      error: null
    };
  },

  get: function (collectionName) {
    const record = this.props.collections.map[collectionName];
    if (!record) {
      this.props.dispatch(getCollection(collectionName));
    }
  },

  componentWillMount: function () {
    const collectionName = this.props.params.collectionName;
    if (collectionName) {
      this.get(collectionName);
    }
    this.props.dispatch(getSchema(SCHEMA_KEY));
  },

  componentWillReceiveProps: function (newProps) {
    const collectionName = newProps.params.collectionName;
    if (this.state.collectionName === collectionName) { return; }

    const record = get(this.props.collections.map, collectionName, {});

    // record has hit an API error
    if (record.error) {
      this.setState({
        collectionName,
        error: record.error
      });
    } else if (record.data) {
      // record has hit an API success; update the UI
      this.setState({
        collectionName,
        error: null
      });
    } else if (!record.inflight) {
      // we've not yet fetched the record, request it
      this.get(collectionName);
    }
  },

  onSubmit: function (id, payload) {
    const collectionName = this.props.params.collectionName;
    const record = this.props.collections.map[collectionName];
    const json = merge(record.data, payload);
    this.setState({ error: null });
    json.updatedAt = new Date().getTime();
    json.changedBy = 'Cumulus Dashboard';
    this.props.dispatch(updateCollection(json));
  },

  render: function () {
    const collectionName = this.props.params.collectionName;
    const record = get(this.props.collections.map, [collectionName], {});
    const meta = get(this.props.collections.updated, [collectionName], {});
    const error = this.state.error || record.error || meta.error;
    const schema = this.props.schema[SCHEMA_KEY];
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Edit {collectionName}</h1>
          {schema && record.data ? (
            <Schema
              schema={schema}
              data={record.data}
              pk={collectionName}
              onSubmit={this.onSubmit}
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

export default connect(state => state)(EditCollection);
