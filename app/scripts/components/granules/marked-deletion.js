'use strict';
import React from 'react';
import { connect } from 'react-redux';

var MarkedDeletion = React.createClass({
  displayName: 'MarkedDeletion',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a page for granules that have been marked for deletion</h1>
      </div>
    );
  }
});

export default connect(state => state)(MarkedDeletion);
