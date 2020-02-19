'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import _config from '../../config';

const { updateInterval } = _config;

const delay = updateInterval / 1000;

class Timer extends React.Component {
  constructor () {
    super();
    this.state = {
      running: true,
      seconds: delay
    };
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.toggle = this.toggle.bind(this);
    this.createTimer = this.createTimer.bind(this);
    this.interval = this.interval.bind(this);
    this.parentClass = this.parentClass.bind(this);
  }

  componentDidMount () {
    this.createTimer(this.props.config);
  }

  componentDidUpdate (prevProps) {
    if (JSON.stringify(prevProps.config) !== JSON.stringify(this.props.config) ||
      (this.props.reload && prevProps.reload !== this.props.reload)) {
      this.createTimer(this.props.config);
    }
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  stop () {
    if (this.cancelInterval) { this.cancelInterval(); }
    this.setState({ seconds: -1, running: false });
  }

  start () {
    this.setState({ seconds: 0, running: true });
    this.createTimer(this.props.config);
  }

  toggle () {
    if (this.state.running) this.stop();
    else this.start();
  }

  createTimer (config) {
    if (this.cancelInterval) { this.cancelInterval(); }
    const { dispatch, action } = this.props;
    this.cancelInterval = this.interval(() => dispatch(action(config)), delay);
  }

  interval (action, seconds) {
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
  }

  parentClass () {
    const className = 'form__element__updateToggle';
    return this.props.noheader ? className + ' form__element__updateToggle-noHeader' : className;
  }

  render () {
    const { seconds } = this.state;
    return (
      <div className={this.parentClass()}>
        <span className='form__element__refresh' onClick={() => this.createTimer(this.props.config)}></span>
        <span className='form-group__updating'>
          Next update in: { seconds === -1 ? '-' : seconds }
        </span>
        <span className='metadata__updated form__element__clickable' onClick={this.toggle}>
          {seconds === -1 ? 'Start automatic updates' : 'Stop automatic updates'}
        </span>
      </div>
    );
  }
}

Timer.propTypes = {
  noheader: PropTypes.bool,
  dispatch: PropTypes.func,
  action: PropTypes.func,
  config: PropTypes.object,
  reload: PropTypes.any
};

export default Timer;
