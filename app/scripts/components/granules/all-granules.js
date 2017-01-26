'use strict';
import React from 'react';
import { connect } from 'react-redux';

var AllGranules = React.createClass({
  displayName: 'AllGranules',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is an all granules page</h1>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
