'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Pdr = React.createClass({
  displayName: 'Pdr',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a component!</h1>
      </div>
    );
  }
});

export default connect(state => state)(Pdr);
