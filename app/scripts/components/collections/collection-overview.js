'use strict';
import React from 'react';
import { connect } from 'react-redux';

var CollectionOverview = React.createClass({
  displayName: 'CollectionOverview',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a page for the collection overview</h1>
      </div>
    );
  }
});

export default connect(state => state)(CollectionOverview);
