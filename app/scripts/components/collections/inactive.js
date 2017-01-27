'use strict';
import React from 'react';
import { connect } from 'react-redux';

var InactiveCollections = React.createClass({
  displayName: 'InactiveCollections',

  render: function () {
    return (
      <div className='page__component'>
        <h1>These are inactive collections</h1>
      </div>
    );
  }
});

export default connect(state => state)(InactiveCollections);
