'use strict';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { queue } from 'd3-queue';
import AsyncCommand from './async-command';
import { updateDelay } from '../../config';

const CONCURRENCY = 3;
const IN_PROGRESS = 'Processing...';

const BatchCommand = React.createClass({
  propTypes: {
    action: PropTypes.func,
    dispatch: PropTypes.func,
    state: PropTypes.object,
    text: PropTypes.string,
    selection: PropTypes.array,
    className: PropTypes.string,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    confirm: PropTypes.func
  },

  getInitialState: function () {
    return {
      callbacks: {},
      activeModal: false,
      completed: 0,
      status: null
    };
  },

  componentWillReceiveProps: function (newProps) {
    const { state } = newProps;
    const { callbacks, completed } = this.state;
    // on success or error, call and remove the saved callback
    Object.keys(callbacks).forEach(id => {
      if (!state[id] || !callbacks[id]) return;
      else if (state[id].status === 'success') callbacks[id](null, id);
      else if (state[id].status === 'error') callbacks[id]({error: state[id].error, id});
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

  // immediately change the UI to show either success or error
  onComplete: function (error, results) {
    this.setState({status: (error ? 'error' : 'success')});
    setTimeout(() => this.cleanup(error, results), updateDelay);
  },

  // call onSuccess and onError functions as needed
  cleanup: function (error, results) {
    const { onSuccess, onError } = this.props;
    this.setState({ activeModal: false, completed: 0, status: null });
    if (error && typeof onError === 'function') onError(error);
    else if (!error && typeof onSuccess === 'function') onSuccess(results);
  },

  isInflight: function () {
    return !!Object.keys(this.state.callbacks).length;
  },

  handleClick: function () {
    if (this.props.confirm) {
      this.setState({ activeModal: true, completed: 0 });
    } else this.start();
  },

  render: function () {
    const { text, selection, className, confirm } = this.props;
    const { activeModal, completed, status } = this.state;
    const todo = selection.length;
    const inflight = this.isInflight();

    // show button as disabled when loading, and in the delay before we clean up.
    const buttonDisabled = inflight || status;
    const modalText = inflight ? IN_PROGRESS
      : !status ? confirm(todo)
      : status === 'success' ? 'Success!' : 'Error';
    return (
      <div>
        <AsyncCommand
          action={this.handleClick}
          text={text}
          className={className}
          disabled={!activeModal && (!todo || !!inflight)}
          successTimeout={0}
          status={!activeModal && inflight ? 'inflight' : null}
        />
        { activeModal ? <div className='modal__cover'></div> : null }
        <div className={ activeModal ? 'modal__container modal__container--onscreen' : 'modal__container' }>
          { activeModal ? (
            <div className='modal'>
              <div className='modal__internal modal__formcenter'>
                <h4 className={'modal__title--' + status}>{modalText}</h4>
                <button className={'button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' + (buttonDisabled ? ' button--disabled' : '')}
                  onClick={this.confirm}>Confirm</button>
                <button className={'button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel' + (buttonDisabled ? ' button--disabled' : '')}
                  onClick={this.cancel}>Cancel</button>
                <div className='modal__loading'>
                  <div className='modal__loading--inner'>
                    <div className={'modal__loading--progress modal__loading--progress--' + status}
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
export default connect()(BatchCommand);
