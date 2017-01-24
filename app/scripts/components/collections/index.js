'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Collections = React.createClass({
  displayName: 'Collections',

  render: function () {
    return (
      <div className='page__collections'>
        <h1>Collections</h1>
      </div>
    );
  }
});

export default connect(state => state)(Collections);
