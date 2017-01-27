'use strict';
import React from 'react';
import { connect } from 'react-redux';

var CollectionErrors = React.createClass({
  displayName: 'CollectionErrors',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a page for collection errors</h1>
      </div>
    );
  }
});

export default connect(state => state)(CollectionErrors);
