'use strict';
import React from 'react';
import Collapsible from 'react-collapsible';
import PropTypes from 'prop-types';
import { truncate } from '../../utils/format';

var ErrorReport = React.createClass({
  displayName: 'ErrorReport',
  propTypes: {
    report: PropTypes.any,
    truncate: PropTypes.bool
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

  truncate: function (string) {
    if (!this.props.truncate) return string;
    else return truncate(string);
  },

  renderReport: function (report) {
    if (typeof report === 'string') {
      return (
        <div key={report}>
          <strong>Error:</strong>
          <Collapsible trigger={this.truncate(report)} triggerWhenOpen={report} />
        </div>
      );
    } else if (report instanceof Error) {
      let name = report.name || 'Error';
      let message, stack;
      if (!report.message) {
        message = JSON.stringify(report);
      } else {
        message = report.message;
        stack = report.stack ? report.stack.split('\\n').map(s => <p key={s}>{s}</p>) : null;
      }
      return (
        <div>
          <p>
            <strong key={message}>{name}: </strong>
            {/* <Collapsible trigger={this.truncate(message)} triggerWhenOpen={message}/> */}
          </p>
          <Collapsible trigger={this.truncate(report.stack)} triggerWhenOpen={stack}/>
        </div>
      );
    } else if (Array.isArray(report)) {
      return report.map(this.renderReport);
    } else if (typeof report === 'object') {
      return this.stringifyErrorObject(report);
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
      return <p key={cause}><strong>{error}: </strong> <Collapsible trigger={this.truncate(cause)} triggerWhenOpen={cause}/></p>;
    } else {
      let stringified = this.truncate(JSON.stringify(obj));
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
