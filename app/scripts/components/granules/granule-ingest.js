'use strict';
import React from 'react';
import { connect } from 'react-redux';

var GranuleIngest = React.createClass({
  displayName: 'GranuleIngest',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a granule ingest page</h1>
      </div>
    );
  }
});

export default connect(state => state)(GranuleIngest);
