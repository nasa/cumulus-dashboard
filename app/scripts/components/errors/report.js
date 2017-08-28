'use strict';
import React from 'react';
import PropTypes from 'prop-types';

var ErrorReport = React.createClass({
  displayName: 'ErrorReport',
  propTypes: {
    report: PropTypes.any
  },

  componentWillReceiveProps: function ({ report }) {
    if (report !== this.props.report) {
      this.scrollToTop();
    }
  },

  scrollToTop: function () {
    if (this.DOMElement && typeof this.DOMElement.scrollIntoView === 'function') {
      this.DOMElement.scrollIntoView(true);
    } else scrollTo(0, 0);
  },

  render: function () {
    const { report } = this.props;
    if (!report) {
      return <div />;
    }
    let message;
    if (typeof report === 'string') {
      message = report;
    } else if (report instanceof Error) {
      message = report.message ? report.message : JSON.stringify(report);
    } else if (typeof report === 'object') {
      message = JSON.stringify(report);
    }
    return (
      <div ref={(e) => { this.DOMElement = e; }} className='error__report'>
        <p><strong>Error:</strong> {message}</p>
      </div>
    );
  }
});

export default ErrorReport;
