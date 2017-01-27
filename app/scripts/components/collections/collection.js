'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Collection = React.createClass({
  displayName: 'Collection',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a collection page</h1>
      </div>
    );
  }
});

export default connect(state => state)(Collection);
