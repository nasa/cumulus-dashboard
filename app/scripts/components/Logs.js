'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Logs = React.createClass({
  displayName: 'Logs',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a log page!</h1>
      </div>
    );
  }
});

export default connect(state => state)(Logs);
