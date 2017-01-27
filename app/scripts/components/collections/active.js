'use strict';
import React from 'react';
import { connect } from 'react-redux';

var ActiveCollections = React.createClass({
  displayName: 'ActiveCollections',

  render: function () {
    return (
      <div className='page__component'>
        <h1>These are active collections</h1>
      </div>
    );
  }
});

export default connect(state => state)(ActiveCollections);
