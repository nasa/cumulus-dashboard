'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Granule = React.createClass({
  displayName: 'Granule',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a granule page</h1>
      </div>
    );
  }
});

export default connect(state => state)(Granule);
