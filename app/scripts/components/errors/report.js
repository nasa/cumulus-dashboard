'use strict';
import React from 'react';

var ErrorReport = React.createClass({
  displayName: 'ErrorReport',
  propTypes: {
    report: React.PropTypes.string
  },
  render: function () {
    return (
      <div className='error'>
        <p><strong>Error:</strong> {this.props.report}</p>
      </div>
    );
  }
});

export default ErrorReport;
