'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Overview = React.createClass({
  displayName: 'Overview',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is the overview for granules.</h1>
      </div>
    );
  }
});

export default connect(state => state)(Overview);
