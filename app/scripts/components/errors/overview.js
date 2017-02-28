'use strict';
import React from 'react';
import { connect } from 'react-redux';

var ErrorsOverview = React.createClass({
  displayName: 'ErrorsOverview',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is an error overview page</h1>
      </div>
    );
  }
});

export default connect(state => state)(ErrorsOverview);
