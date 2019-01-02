'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

var Error = createReactClass({
  displayName: 'Error',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is an error page</h1>
      </div>
    );
  }
});

export default connect(state => state)(Error);
