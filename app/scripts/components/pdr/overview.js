'use strict';
import React from 'react';
import { connect } from 'react-redux';

var PdrOverview = React.createClass({
  displayName: 'PdrOverview',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is an overview</h1>
      </div>
    );
  }
});

export default connect(state => state)(PdrOverview);
