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
    onError: React.PropTypes.func,
    confirm: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      callbacks: {},
      activeModal: false
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
    if (this.props.confirm) {
      this.setState({ activeModal: true });
    } else this.start();
  },

  confirm: function () {

  },

  cancel: function () {

  },

  start: function () {
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
    const { text, selection, className, confirm } = this.props;
    const inflight = this.isInflight();
    const { activeModal } = this.state;
    return (
      <div>
        <AsyncCommand
          action={this.handleClick}
          text={text}
          className={className}
          disabled={!selection.length || inflight}
          status={inflight ? 'inflight' : null}
        />
        { activeModal ? <div className='modal__cover'></div> : null }
        <div className={ activeModal ? 'modal__container modal__container--onscreen' : 'modal__container' }>
          { activeModal ? (
            <div className='modal'>
              <div className='modal__internal'>
                <h4>{confirm(selection.length)}</h4>
                <div className='modal__formcenter'>
                  <button className='button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
                    onClick={this.confirm}>Confirm</button>
                  <button className='button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
                    onClick={this.cancel}>Cancel</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
});
export default BatchCommand;
