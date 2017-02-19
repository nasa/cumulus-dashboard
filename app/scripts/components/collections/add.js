'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Form, formTypes, defaults } from '../form';
import { createCollection } from '../../actions';
import * as validate from '../../utils/validate';
import t from '../../utils/strings';

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

  propTypes: {
    dispatch: React.PropTypes.func
  },

  post: function (payload) {
    this.props.dispatch(createCollection(payload));
  },

  render: function () {
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Add a Collection</h1>
          <p className='description'>Instructions to add JSON in the below fields. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt, orci vel tincidunt ultricies, augue libero egestas felis, vel blandit arcu elit et nisl. Pellentesque luctus sapien eu augue sodales auctor.</p>
        </section>
        <Form
          inputMeta={inputElements}
          submit={this.post}
        />
      </div>
    );
  }
});

export default connect(state => state)(AddCollection);
