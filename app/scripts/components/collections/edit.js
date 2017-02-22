'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getCollection } from '../../actions';
import TextArea from '../form/text-area';
import slugify from 'slugify';

var EditCollection = React.createClass({
  displayName: 'EditCollection',

  propTypes: {
    params: React.PropTypes.object,
    api: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      collection: '',
      error: null
    };
  },

  collection: function (collectionName) {
    const record = get(this.props.api, ['map', collectionName]);
    return record;
  },

  get: function (collectionName) {
    if (!this.collection(collectionName)) {
      this.props.dispatch(getCollection(collectionName));
    }
  },

  componentWillMount: function () {
    const collectionName = this.props.params.collectionName;
    this.get(collectionName);
  },

  componentWillReceiveProps: function (newProps) {
    const collectionName = this.props.params.collectionName;
    const newCollectionName = newProps.params.collectionName;
    if (collectionName !== newCollectionName) {
      // switch to a different collection, query it
      return this.get(newCollectionName);
    }
    const record = get(newProps.api, ['collectionDetail', collectionName]);
    if (!this.state.collection || (record.data && collectionName !== record.data.collectionName)) {
      // we've queried a new collection and just received it
      try {
        var collection = JSON.stringify(record.data, null, '\t');
      } catch (e) {
        this.setState({ error: JSON.stringify(e) });
      }
      this.setState({ collection, error: null });
    }
  },

  onChange: function (id, value) {
    this.setState({ collection: value });
  },

  onSubmit: function () {
    const json = JSON.parse(this.state.collection);
    console.log('in onsubmit');
    console.log(json);
    // post using an action
  },

  render: function () {
    const collectionName = this.props.params.collectionName;
    const record = get(this.props.api, ['map', collectionName]);
    if (!record) {
      return <div></div>;
    }

    const label = `Edit ${collectionName}`;
    const id = `edit-${slugify(collectionName)}`;

    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Edit a Collection</h1>
          <form>
            <TextArea
              label={label}
              value={this.state.collection}
              id={id}
              error={this.state.error}
              mode={'json'}
              onChange={this.onChange}
              minLines={1}
              maxLines={200}
            />

          <input
            type='submit'
            value='Submit'
            onClick={this.onSubmit}
            className='button form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
          />

          </form>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(EditCollection);
