'use strict';
import React from 'react';
import Ellipsis from '../app/loading-ellipsis';

const AsyncCommand = React.createClass({

  propTypes: {
    action: React.PropTypes.func,
    success: React.PropTypes.func,
    status: React.PropTypes.string,
    text: React.PropTypes.string,
    className: React.PropTypes.string
  },

  componentWillReceiveProps: function (newProps) {
    if (this.props.status === 'inflight' && newProps.status === 'success' && typeof this.props.success === 'function') {
      this.props.success();
    }
  },

  buttonClass: function (processing) {
    let className = 'button button--small form-group__element--right button--green';
    if (processing) className += ' button--loading';
    if (this.props.className) className += ' ' + this.props.className;
    return className;
  },

  handleClick: function (e) {
    e.preventDefault();
    // prevent duplicate action if the action is already inflight.
    if (this.props.status !== 'inflight') {
      this.props.action();
    }
  },

  render: function () {
    const { status, text } = this.props;
    const inflight = status === 'inflight';
    return (
      <button
        className={this.buttonClass(inflight)}
        onClick={this.handleClick}
        >{text}{inflight ? <Ellipsis /> : ''}</button>
    );
  }
});
export default AsyncCommand;
