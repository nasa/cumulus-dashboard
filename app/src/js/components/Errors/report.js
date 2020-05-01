'use strict';
import React from 'react';
import Collapsible from 'react-collapsible';
import PropTypes from 'prop-types';
import { truncate } from '../../utils/format';

class ErrorReport extends React.Component {
  constructor () {
    super();
    this.scrollToTop = this.scrollToTop.bind(this);
    this.truncate = this.truncate.bind(this);
    this.renderSingleError = this.renderSingleError.bind(this);
    this.renderReport = this.renderReport.bind(this);
    this.stringifyErrorObject = this.stringifyErrorObject.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (!this.props.disableScroll && (this.props.report !== prevProps.report)) {
      this.scrollToTop();
    }
  }

  scrollToTop () {
    if (this.DOMElement && typeof this.DOMElement.scrollIntoView === 'function') {
      this.DOMElement.scrollIntoView(true);
    } else scrollTo(0, 0);
  }

  truncate (string) {
    if (!this.props.truncate) return string;
    else return truncate(string);
  }

  renderSingleError (report, trigger) {
    if (!trigger) {
      trigger = this.truncate(report);
    }
    // No need to make error collapsible if the truncated
    // output is the same length as the original output
    if (typeof report === 'string' &&
        report === trigger &&
        report.length === trigger.length) {
      return <p>{report}</p>;
    }
    return (
      <Collapsible trigger={trigger} triggerWhenOpen={'Show less'}>
        {report}
      </Collapsible>
    );
  }

  renderReport (report) {
    if (typeof report === 'string') {
      return (
        <div key={report}>
          <strong>Error:</strong>
          { this.renderSingleError(report) }
        </div>
      );
    } else if (report instanceof Error) {
      const name = report.name || 'Error';
      let message, stack;
      if (!report.message) {
        message = JSON.stringify(report);
      } else {
        message = report.message;
        stack = report.stack
          ? report.stack.split('\n').map((s, index) => <p key={index}>{s}</p>)
          : null;
      }
      return (
        <div key={message}>
          <strong>{name}: </strong>
          { this.renderSingleError(stack, this.truncate(report.stack)) }
        </div>
      );
    } else if (Array.isArray(report)) {
      return report.map(this.renderReport);
    } else if (typeof report === 'object') {
      return this.stringifyErrorObject(report);
    }
  }

  stringifyErrorObject (obj) {
    let error, cause;
    if (typeof obj.Error !== 'undefined') {
      error = obj.Error;
    }
    if (typeof obj.Cause !== 'undefined') {
      cause = obj.Cause;
    }
    if (error && cause) {
      return (
        <div key={cause}>
          <strong>{error}: </strong>
          { this.renderSingleError(cause) }
        </div>
      );
    } else {
      const stringified = this.truncate(JSON.stringify(obj));
      return <p key={stringified}>{stringified}</p>;
    }
  }

  render () {
    const { report } = this.props;
    if (!report) return <div />;
    return (
      <div ref={(e) => { this.DOMElement = e; }} className='error__report'>
        {this.renderReport(report)}
      </div>
    );
  }
}

ErrorReport.propTypes = {
  report: PropTypes.any,
  truncate: PropTypes.bool,
  disableScroll: PropTypes.bool
};

export default ErrorReport;
