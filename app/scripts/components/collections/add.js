'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { build as formBuilder, formTypes } from '../../utils/form-builder';

var AddCollection = React.createClass({
  displayName: 'AddCollection',

  render: function () {
    const forms = [{
      label: 'Collection Name',
      type: formTypes.text
    }, {
      label: 'Granule Definition',
      type: formTypes.textArea
    }, {
      label: 'Ingest',
      type: formTypes.textArea
    }, {
      label: 'Recipe',
      type: formTypes.textArea
    }];

    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Add a Collection</h1>
          <p className='description'>Instructions to add JSON in the below fields. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt, orci vel tincidunt ultricies, augue libero egestas felis, vel blandit arcu elit et nisl. Pellentesque luctus sapien eu augue sodales auctor.</p>
        </section>
        {formBuilder(forms)}
      </div>
    );
  }
});

export default connect(state => state)(AddCollection);
