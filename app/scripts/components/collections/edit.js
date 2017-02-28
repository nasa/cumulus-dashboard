'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getCollection, updateCollection, PUT_COLLECTION } from '../../actions';
import TextArea from '../form/text-area';
import slugify from 'slugify';
import moment from 'moment';

var EditCollection = React.createClass({
  displayName: 'EditCollection',

  propTypes: {
    params: React.PropTypes.object,
    collections: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      collection: '',
      updatedAt: null,
      error: null
    };
  },

  collection: function (collectionName) {
    const record = get(this.props.collections, ['map', collectionName]);
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

    const record = get(this.props.collections, ['map', collectionName]);
    if (!this.state.collection || (record.data && collectionName !== record.data.collectionName)) {
      // we've queried a new collection and just received it
      try {
        var collection = JSON.stringify(record.data, null, '\t');
      } catch (e) {
        this.setState({ error: JSON.stringify(e) });
      }
      this.setState({ collection, error: null });
    }

    // a collection edit was made and we've received the updated version
    const updatedAt = this.state.updatedAt;
    const newUpdatedAt = get(newProps.collections, ['map', collectionName, 'data', 'updatedAt']);
    if (updatedAt && updatedAt !== newUpdatedAt) {
      this.setState({
        collection: JSON.stringify(get(newProps.collections, ['map', collectionName, 'data']), null, '\t')
      });
    }

    // save the latest error message if relevant
    var latestError = newProps.errors.errors[newProps.errors.errors.length - 1] || null;
    if (latestError && latestError.meta.type === PUT_COLLECTION) {
      this.setState({'error': latestError.error});
    }
  },

  onChange: function (id, value) {
    this.setState({ collection: value });
  },

  onSubmit: function () {
    try {
      var json = JSON.parse(this.state.collection);

      this.setState({
        'updatedAt': json.updatedAt,
        'error': null
      });

      json.updatedAt = moment().unix();
      json.changedBy = 'Cumulus Dashboard';

      this.props.dispatch(updateCollection(json));
    } catch (e) {
      this.setState({'error': 'Syntax error in JSON'});
    }
  },

  render: function () {
    const collectionName = this.props.params.collectionName;

    const record = get(this.props.collections, ['map', collectionName]);
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

          <br />

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
