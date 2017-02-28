'use strict';
import React from 'react';
import { connect } from 'react-redux';

/*
 * This is a sample component.
 * Customize this by changing COMPONENT_NAME to a proper name.
 * Component names should be camel caps, ie MyComponent.
 * Remember to change the displayName property as well.
 * The component name should generally match the display name.
 */

var COMPONENT_NAME = React.createClass({
  displayName: 'COMPONENT_NAME',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a component!</h1>
      </div>
    );
  }
});

export default connect(state => state)(COMPONENT_NAME);
