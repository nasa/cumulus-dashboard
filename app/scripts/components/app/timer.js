'use strict';
import React from 'react';
import { updateInterval } from '../../config';
const delay = updateInterval / 1000;

const Timer = React.createClass({
  propTypes: {
    noheader: React.PropTypes.bool,
    dispatch: React.PropTypes.func,
    action: React.PropTypes.func,
    config: React.PropTypes.object,
    reload: React.PropTypes.any
  },

  componentWillMount: function () {
    this.createTimer(this.props.config);
  },

  componentWillReceiveProps: function (nextProps) {
    if (JSON.stringify(this.props.config) !== JSON.stringify(nextProps.config) ||
      (nextProps.reload && this.props.reload !== nextProps.reload)) {
      this.createTimer(nextProps.config);
    }
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  getInitialState: function () {
    return {
      running: true,
      seconds: delay
    };
  },

  stop: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
    this.setState({ seconds: -1, running: false });
  },

  start: function () {
    this.setState({ seconds: 0, running: true });
    this.createTimer(this.props.config);
  },

  toggle: function () {
    if (this.state.running) this.stop();
    else this.start();
  },

  createTimer: function (config) {
    if (this.cancelInterval) { this.cancelInterval(); }
    const { dispatch, action } = this.props;
    this.cancelInterval = this.interval(() => dispatch(action(config)), delay);
  },

  interval: function (action, seconds) {
    action();
    const intervalId = setInterval(() => {
      this.setState({ seconds: seconds });
      if (seconds === 0) {
        seconds = delay;
        action();
      } else {
        seconds -= 1;
      }
    }, 1000);
    return () => clearInterval(intervalId);
  },

  parentClass: function () {
    const className = 'form__element__updateToggle';
    return this.props.noheader ? className + ' form__element__updateToggle-noHeader' : className;
  },

  render: function () {
    const { seconds } = this.state;
    return (
      <div className={this.parentClass()} onClick={this.toggle}>
        <span className='form-group__updating'>
          Next update in: { seconds === -1 ? '-' : seconds }
        </span>
        <span className='metadata__updated'>
          {seconds === -1 ? 'Start automatic updates' : 'Stop automatic updates'}
        </span>
      </div>
    );
  }
});
export default Timer;
