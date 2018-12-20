'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

var PdrCompleted = createReactClass({
  displayName: 'PdrCompleted',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a completed PDR!</h1>
      </div>
    );
  }
});

export default connect(state => state)(PdrCompleted);
