'use strict';
import React from 'react';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';

var NotFound = createReactClass({
  displayName: '404',

  render: function () {
    return (
      <div className='page__404'>
        <h1>404</h1>
      </div>
    );
  }
});

export default connect(state => state)(NotFound);
