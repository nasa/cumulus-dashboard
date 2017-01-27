'use strict';
import React from 'react';
import { connect } from 'react-redux';

var CollectionLogs = React.createClass({
  displayName: 'CollectionLogs',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a page for collection logs</h1>
      </div>
    );
  }
});

export default connect(state => state)(CollectionLogs);
