/* This will eventually just be a general batchasync */
/* For Deleting Multiple Collections - The  Modal function (later other modals): Need to copy logic from here and implement in BatchDeleteCollectionModal.js */
'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import queue from 'stubborn-queue';
import AsyncCommand from '../AsyncCommands/AsyncCommands';
import _config from '../../config';
import Modal from 'react-bootstrap/Modal';

const { updateDelay } = _config;

const CONCURRENCY = 3;
const IN_PROGRESS = 'Processing...';

class BatchCommand extends React.Component {
  constructor () {
    super();
    this.state = {
      callbacks: {},
      activeModal: false,
      completed: 0,
      status: null
    };
    this.isRunning = false;
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.start = this.start.bind(this);
    this.initAction = this.initAction.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.createErrorMessage = this.createErrorMessage.bind(this);
    this.cleanup = this.cleanup.bind(this);
    this.isInflight = this.isInflight.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate () {
    if (this.isRunning) return;
    this.isRunning = true;
    const { state } = this.props;
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
    this.isRunning = false;
  }

  confirm () {
    if (!this.isInflight()) this.start();
  }

  cancel () {
    // prevent cancel when inflight
    if (!this.isInflight()) this.setState({ activeModal: false });
  }

  start () {
    const { selection } = this.props;
    // if we have inflight callbacks, don't allow further clicks
    if (!Array.isArray(selection) || !selection.length ||
      this.isInflight()) return false;
    const q = queue(CONCURRENCY);
    for (let i = 0; i < selection.length; ++i) {
      q.add(this.initAction, selection[i]);
    }
    q.done(this.onComplete);
  }

  // save a reference to the callback in state, then init the action
  initAction (id, callback) {
    const { dispatch, action } = this.props;
    const { callbacks } = this.state;
    callbacks[id] = callback;
    this.setState({ callbacks });
    return dispatch(action(id));
  }

  // immediately change the UI to show either success or error
  onComplete (errors, results) {
    const delay = this.props.updateDelay ? this.props.updateDelay : updateDelay;
    // turn array of errors from queue into single error for ui
    const error = this.createErrorMessage(errors);
    this.setState({status: (error ? 'error' : 'success')});
    setTimeout(() => {
      this.cleanup(error, results);
    }, delay);
  }

  // combine multiple errors into one
  createErrorMessage (errors) {
    if (!errors || !errors.length) return;
    return `${errors.length} errors occurred: \n${errors.map((err) => err.error.toString()).join('\n')}`;
  }

  // call onSuccess and onError functions as needed
  cleanup (error, results) {
    const { onSuccess, onError } = this.props;
    this.setState({ activeModal: false, completed: 0, status: null });
    if (error && typeof onError === 'function') onError(error);
    if (results && results.length && typeof onSuccess === 'function') onSuccess(results);
  }

  isInflight () {
    return !!Object.keys(this.state.callbacks).length;
  }

  handleClick () {
    if (this.props.confirm) {
      this.setState({ activeModal: true, completed: 0 });
    } else this.start();
  }

  render () {
    const {
      text,
      selection,
      className,
      confirm,
      confirmOptions
    } = this.props;
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
            <Modal
              dialogClassName="batch-async-modal"
              show={true}
              centered
              size="md"
              aria-labelledby="modal__batch-async-modal"
            >
              <Modal.Header className="batch-async-modal__header" closeButton onClick={this.cancel}></Modal.Header>
              <Modal.Title id="modal__batch-async-modal" className="modal__batch-async-title"><h4 className={'modal__title--' + status}>{modalText}</h4></Modal.Title>
              <Modal.Body>
                <div className='modal__internal modal__formcenter'>
                  { confirmOptions ? (confirmOptions).map(option =>
                    <div key={`option-${confirmOptions.indexOf(option)}`}>
                      {option}
                      <br />
                    </div>
                  ) : null }
                  <div className='modal__loading'>
                    <div className='modal__loading--inner'>
                      <div className={'modal__loading--progress modal__loading--progress--' + status}
                        style={{width: (todo ? (completed * 100 / todo) + '%' : 0)}}>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button className={'button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel' + (buttonDisabled ? ' button--disabled' : '')}
                  onClick={this.cancel}>Cancel
                </button>
                <button className={'button button--confirm button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' + (buttonDisabled ? ' button--disabled' : '')}
                  onClick={this.confirm}>Confirm
                </button>
              </Modal.Footer>
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

BatchCommand.propTypes = {
  action: PropTypes.func,
  dispatch: PropTypes.func,
  state: PropTypes.object,
  text: PropTypes.string,
  selection: PropTypes.array,
  className: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  confirm: PropTypes.func,
  confirmOptions: PropTypes.array,
  updateDelay: PropTypes.number
};

export default BatchCommand;
