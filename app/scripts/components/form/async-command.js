'use strict';
import React from 'react';
import c from 'classnames';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Ellipsis from '../app/loading-ellipsis';
import { preventDefault } from '../../utils/noop';
import { updateDelay } from '../../config';

const AsyncCommand = createReactClass({

  propTypes: {
    action: PropTypes.func,
    success: PropTypes.func,
    error: PropTypes.func,
    status: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    successTimeout: PropTypes.number,
    element: PropTypes.string,
    confirmAction: PropTypes.bool,
    confirmText: PropTypes.string,
    confirmOptions: PropTypes.array,
    href: PropTypes.string
  },

  getInitialState: function () {
    return { modal: false };
  },

  UNSAFE_componentWillReceiveProps: function (newProps) {
    if (
      this.props.status === 'inflight' &&
      newProps.status === 'success' &&
      typeof this.props.success === 'function'
    ) {
      const timeout = isNaN(this.props.successTimeout) ? updateDelay : this.props.successTimeout;
      setTimeout(this.props.success, timeout);
    } else if (
      this.props.status === 'inflight' &&
        newProps.status === 'error' &&
        typeof this.props.error === 'function'
    ) {
      this.props.error();
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
    if (this.props.confirmAction) {
      this.setState({ modal: true });
    } else if (this.props.status !== 'inflight' && !this.props.disabled) {
      // prevent duplicate action if the action is already inflight.
      this.props.action();
    }
  },

  confirm: function () {
    this.props.action();
    this.setState({ modal: false });
  },

  cancel: function () {
    this.setState({ modal: false });
  },

  render: function () {
    const { status, text, confirmText, confirmOptions } = this.props;
    const { modal } = this.state;
    const inflight = status === 'inflight';
    const element = this.props.element || 'button';
    const props = {
      className: this.props.element ? this.elementClass(inflight) : this.buttonClass(inflight),
      onClick: this.props.disabled ? preventDefault : this.handleClick
    };
    if (element === 'a') props.href = '#';
    const children = (
      <span>
        {text}{inflight ? <Ellipsis /> : ''}
      </span>
    );
    const button = React.createElement(element, props, children);
    return (
      <div>
        { button }
        { modal ? <div className='modal__cover'></div> : null }
        <div className={c({
          modal__container: true,
          'modal__container--onscreen': modal
        })}>
          { modal ? (
            <div className='modal'>
              <div className='modal__internal modal__formcenter'>
                { confirmOptions ? (confirmOptions).map(option =>
                  <div key={`option-${confirmOptions.indexOf(option)}`}>
                    {option}
                    <br />
                  </div>
                ) : null }
                <h4>{confirmText}</h4>
                <button
                  className='button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
                  onClick={this.confirm}>Confirm</button>
                <button
                  className='button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
                  onClick={this.cancel}>Cancel</button>
              </div>
            </div>
          ) : null }
        </div>
      </div>
    );
  }
});
export default AsyncCommand;
