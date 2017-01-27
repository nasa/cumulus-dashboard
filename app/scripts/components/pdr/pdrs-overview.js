'use strict';
import React from 'react';
import { connect } from 'react-redux';

var PdrsOverview = React.createClass({
  displayName: 'PdrsOverview',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a PDR overview page!</h1>
      </div>
    );
  }
});

export default connect(state => state)(PdrsOverview);
