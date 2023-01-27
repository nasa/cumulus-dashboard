import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import queue from 'stubborn-queue';
import {
  CircularProgressbar,
  CircularProgressbarWithChildren
} from 'react-circular-progressbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap';
import isArray from 'lodash/isArray';
import AsyncCommand from '../AsyncCommands/AsyncCommands';
import DefaultModal from '../Modal/modal';
import ErrorReport from '../Errors/report';

const CONCURRENCY = 3;

/** BatchCommand
 * @description a reusable component for implementing batch async commands. For example:
 * bulk delete, update, etc.
 * @param {object} props
 * @param {function} props.getModalOptions This is the primary function used change the
 * contents of the modal.
 * It returns a modalOptions object which is passed as props to <DefaultModal />
 * Without this prop, by default, an empty modal will open with a progress bar running as
 * the batch commands execute.
 * When using this function, one conditionally display content based on whether it should be
 * displayed after confirm is clicked 'isOnModalConfirm: true',
 * after the action has completed 'isOnModalComplete: true', or neither (e.g. after the initial
 * button that triggered the modal is clicked).
 * All those scenarios can display different content for the modal based on logic setup
 * within getModalOptions.
 */

export class BatchCommand extends React.Component {
  constructor() {
    super();
    this.state = {
      callbacks: {},
      activeModal: false,
      completed: 0,
      status: null,
      modalOptions: null,
      errorMessage: null,
      meta: {},
    };
    this.isRunning = false;
    this.buildId = this.buildId.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.start = this.start.bind(this);
    this.initAction = this.initAction.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.createErrorMessage = this.createErrorMessage.bind(this);
    this.cleanup = this.cleanup.bind(this);
    this.isInflight = this.isInflight.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateMeta = this.updateMeta.bind(this);
  }

  buildId(item) {
    return (typeof item === 'string') ? item : item.granuleId;
  }

  updateMeta(meta) {
    this.setState({ meta: { ...this.state.meta, ...meta } });
  }

  closeModal() {
    this.setState({ activeModal: false });
    this.setState({ meta: {} });
  }

  componentDidUpdate() {
    if (this.isRunning) return;
    this.isRunning = true;
    const { state } = this.props;
    const { callbacks, completed } = this.state;

    // on success or error, call and remove the saved callback
    Object.keys(callbacks).forEach((id) => {
      if (!state[id] || !callbacks[id]) return;
      if (state[id].status === 'success') callbacks[id](null, id);
      else if (state[id].status === 'error') { callbacks[id]({ error: state[id].error, id }); }

      if (state[id].status === 'success' || state[id].status === 'error') {
        delete callbacks[id];
        this.setState({ callbacks, completed: completed + 1 });
      }
    });
    this.isRunning = false;
  }

  confirm() {
    const { selected, history, getModalOptions } = this.props;
    if (typeof getModalOptions === 'function') {
      const modalOptions = getModalOptions({
        selected,
        history,
        isOnModalConfirm: true,
        isOnModalComplete: false,
        closeModal: this.closeModal,
      });
      this.setState({ modalOptions });

      // if we're replacing the onConfirm function, we don't want to continue with the current one
      if (modalOptions.onConfirm) {
        return;
      }
    }
    if (!this.isInflight()) this.start();
  }

  cancel() {
    // prevent cancel when inflight
    if (!this.isInflight()) this.setState({ activeModal: false });
  }

  start() {
    const { selected } = this.props;
    // if we have inflight callbacks, don't allow further clicks
    if (!Array.isArray(selected) || !selected.length || this.isInflight()) { return false; }
    const q = queue(CONCURRENCY);
    for (let i = 0; i < selected.length; i += 1) {
      q.add(this.initAction, this.buildId(selected[i]));
    }
    q.done(this.onComplete);
  }

  // save a reference to the callback in state, then init the action
  initAction(id, callback) {
    const { dispatch, action } = this.props;
    const { callbacks, meta } = this.state;
    callbacks[id] = callback;
    this.setState({ callbacks });
    return dispatch(action(id, meta));
  }

  // immediately change the UI to show either success or error
  onComplete(errors, results) {
    const {
      getModalOptions,
      selected,
      history,
    } = this.props;
    // turn array of errors from queue into single error for ui
    const errorMessage = this.createErrorMessage(errors);
    this.setState({ errorMessage, results, status: errorMessage ? 'error' : 'success' });
    if (typeof getModalOptions === 'function') {
      // setTimeout(() => {
      const modalOptions = getModalOptions({
        history,
        selected,
        results,
        errors,
        errorMessage,
        isOnModalComplete: true,
        closeModal: this.closeModal,
      });
      this.setState({ modalOptions, status: null });
    }
  }

  // combine multiple errors into one
  createErrorMessage(errors) {
    if (!errors || !errors.length) return;
    return `${errors.length} error(s) occurred: \n${errors
      .map((err) => err.error.toString())
      .join('\n')}`;
  }

  // call onSuccess and onError functions as needed
  cleanup(e) {
    const { errorMessage, results } = this.state;
    const {
      clearError,
      dispatch,
      onSuccess,
      onError,
      selected,
    } = this.props;
    if (errorMessage && typeof onError === 'function') onError(errorMessage);
    if (results && results.length && typeof onSuccess === 'function') { onSuccess(results, errorMessage); }

    if (typeof clearError === 'function') {
      selected.forEach((item) => dispatch(clearError(this.buildId(item))));
    }

    this.setState({ activeModal: false, completed: 0, errorMessage: null, results: null, status: null });
  }

  isInflight() {
    return !!Object.keys(this.state.callbacks).length;
  }

  handleClick() {
    const { selected, history, getModalOptions } = this.props;
    if (typeof getModalOptions === 'function') {
      const modalOptions = getModalOptions({
        onChange: this.updateMeta,
        selected,
        history,
        closeModal: this.closeModal,
      });
      this.setState({ modalOptions });
    }
    if (this.props.confirm) {
      this.setState({ activeModal: true, completed: 0 });
    } else this.start();
  }

  render() {
    const { text, selected, className, confirm, confirmOptions } = this.props;
    const { activeModal, completed, errorMessage, status, modalOptions } = this.state;
    const todo = selected.length;
    const inflight = this.isInflight();

    // show button as disabled when loading, and in the delay before we clean up.
    const buttonClass = inflight ? 'button--disabled' : '';
    const confirmResult = confirm(todo);
    const confirmTextArray = isArray(confirmResult) ? confirmResult : [confirmResult];
    const percentage = todo ? ((completed * 100) / todo).toFixed(2) : 0;

    return (
      <div>
        <AsyncCommand
          action={this.handleClick}
          text={text}
          className={className}
          hidden={!activeModal && (!todo || !!inflight)}
          status={!activeModal && inflight ? 'inflight' : null}
        />
        {activeModal && <div className="modal__cover"></div>}
        <div
          className={
            activeModal
              ? 'modal__container modal__container--onscreen'
              : 'modal__container'
          }
        >
          <DefaultModal
            className="batch-async-modal"
            /* Need to separate cancel and close button functions because cancel is secondary and close is primary */
            onCancel={status ? this.cleanup : this.cancel}
            cancelButtonText={status ? 'Close' : 'Cancel'}
            onCloseModal={status ? this.cleanup : this.cancel}
            onConfirm={this.confirm}
            title={text}
            showModal={activeModal}
            confirmButtonClass={`${buttonClass} button--submit`}
            cancelButtonClass={`${buttonClass} button--cancel`}
            hasConfirmButton={!status} /* if status is set, we just want to close the modal */
            {...modalOptions}
            {...inflight ? { size: 'md' } : {}}
          >
            {inflight &&
              <>
                <p className="progress-text">One moment while your request is processing</p>
                <CircularProgressbar background="true" text={`${percentage}%`} strokeWidth="2" value={percentage} />
              </>
            }
            {status === 'success' &&
            <>
              <Alert variant="success"><strong>Success!</strong></Alert>
              <CircularProgressbarWithChildren background="true" className="success" strokeWidth="2" value={100}>
                <FontAwesomeIcon icon={faCheck} />
              </CircularProgressbarWithChildren>
            </>
            }
            {status === 'error' &&
            <>
              <div>
                <Alert variant="danger"><strong>Error</strong></Alert>
                <ErrorReport report= {errorMessage}/>
              </div>
            </>
            }
            {(!inflight && !status) && (!modalOptions || !modalOptions.children) && (
              <>
                <div>{confirmTextArray.map((confirmText, index) => (
                  <React.Fragment key={index}>
                    {confirmText}
                  </React.Fragment>
                ))}</div>
                <div className="modal__internal modal__formcenter">
                  {confirmOptions &&
                    confirmOptions.map((option) => (
                      <div key={`option-${confirmOptions.indexOf(option)}`}>
                        {option}
                        <br />
                      </div>))
                  }
                </div>
              </>
            )}
            {modalOptions && modalOptions.children}
          </DefaultModal>
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
  selected: PropTypes.array,
  className: PropTypes.string,
  clearError: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  confirm: PropTypes.func,
  confirmOptions: PropTypes.array,
  getModalOptions: PropTypes.func,
  history: PropTypes.object,
};

export default withRouter(BatchCommand);
