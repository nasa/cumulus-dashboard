'use strict';
import React from 'react';
import { queue } from 'd3-queue';
import AsyncCommand from './async-command';

const CONCURRENCY = 3;

const BatchCommand = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    action: React.PropTypes.func,
    state: React.PropTypes.object,
    text: React.PropTypes.string,
    selection: React.PropTypes.array,
    className: React.PropTypes.string,
    onSuccess: React.PropTypes.func,
    onError: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      callbacks: {}
    };
  },

  componentWillReceiveProps: function (newProps) {
    const { state } = newProps;
    const { callbacks } = this.state;
    // on success or error, call and remove the saved callback
    Object.keys(callbacks).forEach(id => {
      if (!state[id] || !callbacks[id]) return;
      else if (state[id].status === 'success') callbacks[id](null, id);
      else if (state[id].status === 'error') callbacks[id](state[id].error);
      if (state[id].status === 'success' || state[id].status === 'error') {
        delete callbacks[id];
        this.setState({ callbacks });
      }
    });
  },

  // save a reference to the callback in state, then init the action
  initAction: function (id, callback) {
    const { dispatch, action } = this.props;
    const { callbacks } = this.state;
    callbacks[id] = callback;
    this.setState({ callbacks });
    return dispatch(action(id));
  },

  // call onSuccess and onError functions as needed
  onComplete: function (error, results) {
    const { onSuccess, onError } = this.props;
    if (error && typeof onError === 'function') onError(error);
    else if (!error && typeof onSuccess === 'function') onSuccess(results);
  },

  isInflight: function () {
    return !!Object.keys(this.state.callbacks).length;
  },

  handleClick: function () {
    const { selection } = this.props;
    // if we have inflight callbacks, don't allow further clicks
    if (!Array.isArray(selection) || !selection.length ||
      this.isInflight()) return false;
    const q = queue(CONCURRENCY);
    for (let i = 0; i < selection.length; ++i) {
      q.defer(this.initAction, selection[i]);
    }
    q.awaitAll(this.onComplete);
  },

  render: function () {
    const { text, selection, className } = this.props;
    const inflight = this.isInflight();
    return (
      <AsyncCommand
        action={this.handleClick}
        text={text}
        className={className}
        disabled={!selection.length || inflight}
        status={inflight ? 'inflight' : null}
      />
    );
  }
});
export default BatchCommand;
