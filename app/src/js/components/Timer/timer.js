/* eslint-disable no-param-reassign */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import _config from '../../config';
import {
  TIMER_START,
  TIMER_STOP,
  TIMER_SET_COUNTDOWN,
} from '../../actions/types';

const { updateInterval } = _config;
const oneSecondTick = 1000;
const secondsToRefresh = updateInterval / 1000;

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.toggle = this.toggle.bind(this);
    this.refreshTimer = this.refreshTimer.bind(this);
    this.interval = this.interval.bind(this);
    this.parentClass = this.parentClass.bind(this);
  }

  componentDidMount() {
    this.refreshTimer(this.props.config);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.config, this.props.config) ||
      (this.props.reload && (prevProps.reload !== this.props.reload)) ||
      !isEqual(prevProps.datepicker, this.props.datepicker)
    ) {
      this.refreshTimer(this.props.config);
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
    this.props.dispatch({ type: TIMER_STOP });
  }

  start() {
    this.props.dispatch({ type: TIMER_START, secondsToRefresh });
    this.refreshTimer(this.props.config, true);
  }

  toggle() {
    this.props.timer.running ? this.stop() : this.start();
  }

  refreshTimer(config, startCountdown) {
    if (this.cancelInterval) {
      this.cancelInterval();
    }
    const { dispatch, action } = this.props;
    dispatch(action(config));
    if (this.props.timer.running || startCountdown) {
      this.cancelInterval = this.interval(
        () => dispatch(action(config)),
        secondsToRefresh
      );
    }
  }

  interval(action, seconds) {
    const intervalId = setInterval(() => {
      if (seconds === 0) {
        seconds = secondsToRefresh;
        action();
      } else {
        seconds -= 1;
      }
      this.props.dispatch({
        type: TIMER_SET_COUNTDOWN,
        secondsToRefresh: seconds,
      });
    }, oneSecondTick);
    return () => clearInterval(intervalId);
  }

  parentClass() {
    const className = 'form__element__updateToggle';
    return this.props.noheader
      ? `${className} form__element__updateToggle-noHeader`
      : className;
  }

  render() {
    const { seconds, running } = this.props.timer;
    return (
      <div className={this.parentClass()}>
        <span
          data-cy="refreshTimer"
          className="form__element__refresh"
          onClick={() => this.refreshTimer(this.props.config)}
          role="button"
          tabIndex="0"
          aria-label="Refresh Timer"
        ></span>
        <span data-cy="startStopLabel" className="form-group__updating">
          {running ? `Next update in: ${seconds}` : 'Update'}
        </span>
        <span
          data-cy="toggleTimer"
          className="metadata__updated form__element__clickable"
          onClick={this.toggle}
          role="button"
          tabIndex="0"
        >
          {running ? 'Stop automatic updates' : 'Start automatic updates'}
        </span>
      </div>
    );
  }
}

Timer.propTypes = {
  action: PropTypes.func,
  config: PropTypes.object,
  datepicker: PropTypes.object,
  dispatch: PropTypes.func,
  noheader: PropTypes.bool,
  reload: PropTypes.any,
  timer: PropTypes.object,
};

export default connect((state) => ({
  datepicker: state.datepicker,
  timer: state.timer,
}))(Timer);
