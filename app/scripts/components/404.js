'use strict';
import React from 'react';
import { connect } from 'react-redux';

var NotFound = React.createClass({
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
