'use strict';
import React from 'react';

var ErrorReport = React.createClass({
  displayName: 'ErrorReport',
  propTypes: {
    report: React.PropTypes.string
  },
  render: function () {
    const { report } = this.props;
    let message;
    if (typeof report === 'string') {
      message = report;
    } else if (report instanceof Error) {
      message = report.message ? report.message : JSON.stringify(report);
    } else if (typeof report === 'object') {
      message = JSON.stringify(report);
    }
    return (
      <div className='error__report'>
        <p><strong>Error:</strong> {message}</p>
      </div>
    );
  }
});

export default ErrorReport;
