'use strict';
import React from 'react';
import { connect } from 'react-redux';

var PdrActive = React.createClass({
  displayName: 'PdrActive',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is an active PDR!</h1>
      </div>
    );
  }
});

export default connect(state => state)(PdrActive);
