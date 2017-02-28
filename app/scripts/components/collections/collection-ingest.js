'use strict';
import React from 'react';
import { connect } from 'react-redux';

var CollectionIngest = React.createClass({
  displayName: 'CollectionIngest',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a page for collection ingests</h1>
      </div>
    );
  }
});

export default connect(state => state)(CollectionIngest);
