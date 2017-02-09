'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Overview = React.createClass({
  displayName: 'Overview',

  propTypes: {
    api: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  getProcessingGranules: function () {
    // TODO hook up endpoint for processing granules once that's available
  },

  render: function () {
    return (
      <div className='page__component'>
        <h1 className='heading--large heading--shared-content'>Granules Overview</h1>
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium'>Processing Granules (10)</h2>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Overview);
