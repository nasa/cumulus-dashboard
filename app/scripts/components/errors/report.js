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

  renderReport: function (report) {
    if (typeof report === 'string') {
      return <p key={report}><strong>Error:</strong> {report}</p>;
    } else if (report instanceof Error) {
      let name = report.name || 'Error';
      let message = report.message || JSON.stringify(report);
      return <p><strong key={message}>{name}: </strong> {message}</p>;
    } else if (typeof report === 'object') {
      return this.stringifyErrorObject(report);
    } else if (Array.isArray(report)) {
      return report.map(this.renderReport);
    }
  },

  stringifyErrorObject: function (obj) {
    let error, cause;
    if (typeof obj.Error !== 'undefined') {
      error = obj.Error;
    }
    if (typeof obj.Cause !== 'undefined') {
      cause = obj.Cause;
    }
    if (error && cause) {
      return <p key={cause}><strong>{error}: </strong> {cause}</p>;
    } else {
      let stringified = JSON.stringify(obj);
      return <p key={stringified}>{stringified}</p>;
    }
  },

  render: function () {
    const { report } = this.props;
    if (!report) return <div />;
    return (
      <div ref={(e) => { this.DOMElement = e; }} className='error__report'>
        {this.renderReport(report)}
      </div>
    );
  }
});

export default ErrorReport;
