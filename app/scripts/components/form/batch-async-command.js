'use strict';
import React from 'react';
import { queue } from 'd3-queue';
import AsyncCommand from './async-command';
import { updateDelay } from '../../config';

const CONCURRENCY = 3;
const IN_PROGRESS = 'Processing...';

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
      activeModal: false,
      completed: 0
    };
  },

  componentWillReceiveProps: function (newProps) {
    const { state } = newProps;
    const { callbacks, completed } = this.state;
    // on success or error, call and remove the saved callback
    Object.keys(callbacks).forEach(id => {
      if (!state[id] || !callbacks[id]) return;
      else if (state[id].status === 'success') callbacks[id](null, id);
      else if (state[id].status === 'error') callbacks[id](state[id].error);
      if (state[id].status === 'success' || state[id].status === 'error') {
        delete callbacks[id];
        this.setState({ callbacks, completed: completed + 1 });
      }
    });
  },

  confirm: function () {
    if (!this.isInflight()) this.start();
  },

  cancel: function () {
    // prevent cancel when inflight
    if (!this.isInflight()) this.setState({ activeModal: false });
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
    setTimeout(() => this.cleanup(), updateDelay);
  },

  cleanup: function () {
    this.setState({ activeModal: false, completed: 0 });
  },

  isInflight: function () {
    return !!Object.keys(this.state.callbacks).length;
  },

  handleClick: function () {
    if (this.props.confirm) {
      this.setState({ activeModal: true });
    } else this.start();
  },

  render: function () {
    const { text, selection, className, confirm } = this.props;
    const { activeModal, completed } = this.state;
    const todo = selection.length;
    const done = (todo && completed === todo);
    const inflight = this.isInflight();
    return (
      <div>
        <AsyncCommand
          action={this.handleClick}
          text={text}
          className={className}
          disabled={!activeModal && (!todo || !!inflight)}
          status={!activeModal && inflight ? 'inflight' : null}
        />
        { activeModal ? <div className='modal__cover'></div> : null }
        <div className={ activeModal ? 'modal__container modal__container--onscreen' : 'modal__container' }>
          { activeModal ? (
            <div className='modal'>
              <div className='modal__internal modal__formcenter'>
                <h4>{done ? 'Success!' : inflight ? IN_PROGRESS : confirm(todo)}</h4>
                <button className={'button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' + (inflight || done ? ' button--disabled' : '')}
                  onClick={this.confirm}>Confirm</button>
                <button className={'button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel' + (inflight || done ? ' button--disabled' : '')}
                  onClick={this.cancel}>Cancel</button>
                <div className='modal__loading'>
                  <div className='modal__loading--inner'>
                    <div className='modal__loading--progress'
                      style={{width: (todo ? (completed * 100 / todo) + '%' : 0)}}>
                    </div>
                  </div>
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
