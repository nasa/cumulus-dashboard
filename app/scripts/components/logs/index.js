'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Logs = React.createClass({
  displayName: 'Logs',

  render: function () {
    return (
      <div className='page__logs'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Logs</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='row'>

          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Logs);
