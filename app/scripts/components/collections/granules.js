'use strict';
import React from 'react';
import { connect } from 'react-redux';

var CollectionGranules = React.createClass({
  displayName: 'CollectionGranules',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a page for collection granules</h1>
      </div>
    );
  }
});

export default connect(state => state)(CollectionGranules);
