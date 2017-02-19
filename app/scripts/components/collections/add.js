'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Form, formTypes } from '../form';

const inputElements = [{
  label: 'Collection Name',
  type: formTypes.text
}, {
  label: 'Granule Definition',
  type: formTypes.textArea,
  mode: 'json'
}, {
  label: 'Ingest',
  type: formTypes.textArea,
  mode: 'json'
}, {
  label: 'Recipe',
  type: formTypes.textArea,
  mode: 'json'
}];

var AddCollection = React.createClass({
  displayName: 'AddCollection',

  render: function () {
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Add a Collection</h1>
          <p className='description'>Instructions to add JSON in the below fields. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt, orci vel tincidunt ultricies, augue libero egestas felis, vel blandit arcu elit et nisl. Pellentesque luctus sapien eu augue sodales auctor.</p>
        </section>
        <Form inputs={inputElements} />
      </div>
    );
  }
});

export default connect(state => state)(AddCollection);
