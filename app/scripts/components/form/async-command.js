'use strict';
import React from 'react';
import Ellipsis from '../app/loading-ellipsis';
import { preventDefault } from '../../utils/noop';

const AsyncCommand = React.createClass({

  propTypes: {
    action: React.PropTypes.func,
    success: React.PropTypes.func,
    status: React.PropTypes.string,
    text: React.PropTypes.string,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    successTimeout: React.PropTypes.number,
    element: React.PropTypes.string
  },

  componentWillReceiveProps: function (newProps) {
    if (
      this.props.status === 'inflight' &&
      newProps.status === 'success' &&
      typeof this.props.success === 'function'
    ) {
      setTimeout(this.props.success, this.props.successTimeout || 0);
    }
  },

  buttonClass: function (processing) {
    let className = 'button button--small form-group__element button--green';
    if (processing) className += ' button--loading';
    if (this.props.disabled) className += ' button--disabled';
    if (this.props.className) className += ' ' + this.props.className;
    return className;
  },

  // a generic className generator for non-button elements
  elementClass: function (processing) {
    let className = 'async__element';
    if (processing) className += ' async__element--loading';
    if (this.props.disabled) className += ' async__element--disabled';
    if (this.props.className) className += ' ' + this.props.className;
    return className;
  },

  handleClick: function (e) {
    e.preventDefault();
    // prevent duplicate action if the action is already inflight.
    if (this.props.status !== 'inflight' && !this.props.disabled) {
      this.props.action();
    }
  },

  render: function () {
    const { status, text } = this.props;
    const inflight = status === 'inflight';
    const element = this.props.element || 'button';
    return React.createElement(element, {
      className: this.props.element ? this.elementClass(inflight) : this.buttonClass(inflight),
      onClick: this.props.disabled ? preventDefault : this.handleClick
    }, (
      <span>
        {text}{inflight ? <Ellipsis /> : ''}
      </span>
    ));
  }
});
export default AsyncCommand;
