import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from '../../utils/format';
import ShowMoreOrLess from './show-more-or-less';
import CopyToClipboard from './copy-to-clipboard';

class ErrorReport extends React.Component {
  constructor () {
    super();
    this.scrollToTop = this.scrollToTop.bind(this);
    this.truncate = this.truncate.bind(this);
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
    } else if (window) {
      window.scrollTo(0, 0);
    }
  }

  truncate (string) {
    if (!this.props.truncate) return string;
    return truncate(string);
  }

  renderReport (report) {
    if (typeof report === 'string') {
      return (
        <div key={report}>
          <strong>Error:</strong>
          <ShowMoreOrLess text={report} truncate={this.props.truncate}/>
          <CopyToClipboard text = {report} />
        </div>
      );
    }

    if (report instanceof Error) {
      const name = report.name || 'Error';
      let message;
      let stack;
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
          <ShowMoreOrLess text={stack} truncate={this.props.truncate}></ShowMoreOrLess>
        </div>
      );
    }

    if (Array.isArray(report)) {
      return report.map(this.renderReport);
    }

    if (typeof report === 'object') {
      return this.stringifyErrorObject(report);
    }
  }

  stringifyErrorObject (obj) {
    let error;
    let cause;
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
          <ShowMoreOrLess text={cause} truncate={this.props.truncate}></ShowMoreOrLess>
        </div>
      );
    }

    const stringified = this.truncate(JSON.stringify(obj));
    return <p key={stringified}>{stringified}</p>;
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
