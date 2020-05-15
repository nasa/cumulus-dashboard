'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import _config from '../../config';

const { updateInterval } = _config;

const oneSecondTick = 1000;
const secondsToRefresh = updateInterval / 1000;

class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      running: false,
      seconds: -1,
    };
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.toggle = this.toggle.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.interval = this.interval.bind(this);
    this.parentClass = this.parentClass.bind(this);
  }

  componentDidMount() {
    this.startTimer(this.props.config);
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.config) !== JSON.stringify(this.props.config) ||
      (this.props.reload && prevProps.reload !== this.props.reload)
    ) {
      this.startTimer(this.props.config);
    }
  }

  componentWillUnmount() {
    if (this.cancelInterval) {
      this.cancelInterval();
    }
  }

  stop() {
    if (this.cancelInterval) {
      this.cancelInterval();
    }
    this.setState({ seconds: -1, running: false });
  }

  start() {
    this.setState({ seconds: secondsToRefresh, running: true });
    this.startTimer(this.props.config);
  }

  toggle() {
    this.state.running ? this.stop() : this.start();
  }

  startTimer(config) {
    if (this.cancelInterval) {
      this.cancelInterval();
    }
    const { dispatch, action } = this.props;

    this.cancelInterval = this.interval(
      () => dispatch(action(config)),
      secondsToRefresh
    );
  }

  interval(action, seconds) {
    action();
    const intervalId = setInterval(() => {
      if (seconds === 0) {
        seconds = secondsToRefresh;
        action();
      } else {
        seconds -= 1;
      }
      this.setState({ seconds: seconds });
    }, oneSecondTick);
    return () => clearInterval(intervalId);
  }

  parentClass() {
    const className = 'form__element__updateToggle';
    return this.props.noheader
      ? className + ' form__element__updateToggle-noHeader'
      : className;
  }

  render() {
    const { seconds, running } = this.state;
    return (
      <div className={this.parentClass()}>
        <span
          className="form__element__refresh"
          onClick={() => this.startTimer(this.props.config)}
        ></span>
        <span className="form-group__updating">
          {running ? `Next update in: ${seconds}` : 'Update'}
        </span>
        <span
          className="metadata__updated form__element__clickable"
          onClick={this.toggle}
        >
          {running ? 'Stop automatic updates' : 'Start automatic updates'}
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
  reload: PropTypes.any,
};

export default Timer;
