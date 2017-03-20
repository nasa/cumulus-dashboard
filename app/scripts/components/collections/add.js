'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { Form, formTypes, defaults } from '../form';
import { createCollection } from '../../actions';
import * as validate from '../../utils/validate';
import t from '../../utils/strings';
import ErrorReport from '../errors/report';
import Loading from '../app/loading-indicator';

const inputElements = [
  {
    schemaProperty: 'collectionName',
    label: 'Collection Name',
    type: formTypes.text,
    validate: validate.isText,
    error: t.errors.collectionName
  },

  {
    schemaProperty: 'granuleDefinition',
    label: 'Granule Definition',
    type: formTypes.textArea,
    mode: 'json',
    value: defaults.json
  },

  {
    schemaProperty: 'ingest',
    label: 'Ingest',
    type: formTypes.textArea,
    mode: 'json',
    value: defaults.json
  },

  {
    schemaProperty: 'recipe',
    label: 'Recipe',
    type: formTypes.textArea,
    mode: 'json',
    value: defaults.json
  }
];

var AddCollection = React.createClass({
  displayName: 'AddCollection',

  getInitialState: function () {
    return {
      collectionName: null
    };
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    collections: React.PropTypes.object
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
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large'>Add a Collection</h1>
            <p className='description'>Instructions to add JSON in the below fields. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt, orci vel tincidunt ultricies, augue libero egestas felis, vel blandit arcu elit et nisl. Pellentesque luctus sapien eu augue sodales auctor.</p>
          </div>
          {record.status === 'inflight' ? <Loading /> : null}
          <Form
            inputMeta={inputElements}
            submit={this.post}
          />
          {record.status === 'error' ? <ErrorReport report={record.error} /> : null}
        </section>
      </div>
    );
  }
});

export default connect(state => state)(AddCollection);
