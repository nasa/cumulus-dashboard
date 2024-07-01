import React, { useEffect, useState, useRef } from 'react';
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

export const BatchCommand = ({
  action,
  dispatch,
  state,
  text = '',
  selected = [],
  className = '',
  clearError,
  onSuccess,
  onError,
  confirmOptions = [],
  getModalOptions,
  history
}) => {
  const [activeModal, setActiveModal] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [modalOptions, setModalOptions] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [meta, setMeta] = useState({});
  const [results, setResults] = useState(null);
  const callbacksRef = useRef({});
  const isRunningRef = useRef(false);

  // eslint-disable-next-line arrow-body-style
  const buildId = (item) => {
    return (typeof item === 'string') ? item : item.granuleId;
  };

  const updateMeta = (newMeta) => {
    setMeta((prevMeta) => ({
      ...prevMeta,
      ...newMeta
    }));
  };

  const closeModal = () => {
    setActiveModal(false);
    setMeta({});
  };

  const isInflight = () => !!Object.keys(callbacksRef.current).length;

  useEffect(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    const newCallbacks = { ...callbacksRef.current };

    // on success or error, call and remove the saved callback
    Object.keys(callbacksRef.current).forEach((id) => {
      if (!state[id] || !callbacksRef.current[id]) return;
      if (state[id].status === 'success') callbacksRef.current[id](null, id);
      else if (state[id].status === 'error') { callbacksRef.current[id]({ error: state[id].error, id }); }

      if (state[id].status === 'success' || state[id].status === 'error') {
        delete newCallbacks[id];
        setCompleted((prevCompleted) => prevCompleted + 1);
        callbacksRef.cureent = newCallbacks;
      }
    });
    isRunningRef.current = false;
  }, [state]);

  // combine multiple errors into one
  const createErrorMessage = (errors) => {
    if (!errors || !errors.length) return null;
    return `${errors.length} error(s) occurred: \n${errors
      .map((err) => err.error.toString())
      .join('\n')}`;
  };

  const cancel = () => {
    // prevent cancel when inflight
    if (!isInflight()) {
      setActiveModal(false);
    }
  };

  // save a reference to the callback in state, then init the action
  const initAction = (id, callback) => {
    callbacksRef.current[id] = callback;
    return dispatch(action(id, meta));
  };

  // immediately change the UI to show either success or error
  const onComplete = (errors) => {
    // turn array of errors from queue into single error for ui
    const generatedErrorMessage = createErrorMessage(errors);
    setErrorMessage(generatedErrorMessage);
    setStatus(generatedErrorMessage ? 'error' : 'success');
    setResults(results);

    if (typeof getModalOptions === 'function') {
      // setTimeout(() => {
      const modalOpts = getModalOptions({
        history,
        selected,
        results,
        errors,
        errorMessage: generatedErrorMessage,
        isOnModalComplete: true,
        closeModal,
      });
      setModalOptions(modalOpts);
      setStatus(null);
    }
  };

  const start = () => {
    // if we have inflight callbacks, don't allow further clicks
    if (!Array.isArray(selected) || !selected.length || isInflight()) { return false; }
    const q = queue(CONCURRENCY);
    for (let i = 0; i < selected.length; i += 1) {
      q.add(initAction, buildId(selected[i]));
    }
    q.done(onComplete);
  };

  const confirm = () => {
    if (typeof getModalOptions === 'function') {
      const modalOpts = getModalOptions({
        selected,
        history,
        isOnModalConfirm: true,
        isOnModalComplete: false,
        closeModal,
      });
      setModalOptions(modalOpts);

      // if we're replacing the onConfirm function, we don't want to continue with the current one
      if (modalOpts && modalOptions.onConfirm) {
        return;
      }
    }
    if (!isInflight()) start();
  };

  // call onSuccess and onError functions as needed
  const cleanup = (e) => {
    if (errorMessage && typeof onError === 'function') onError(errorMessage);
    if (results && results.length && typeof onSuccess === 'function') { onSuccess(results, errorMessage); }

    if (typeof clearError === 'function') {
      selected.forEach((item) => dispatch(clearError(buildId(item))));
    }

    setActiveModal(false);
    setCompleted(0);
    setErrorMessage(null);
    setStatus(null);
  };

  const handleClick = () => {
    if (typeof getModalOptions === 'function') {
      const modalOpts = getModalOptions({
        onChange: updateMeta,
        selected,
        history,
        closeModal,
      });
      setModalOptions(modalOpts);
    }
    if (confirm) {
      setActiveModal(true);
      setCompleted(0);
    } else start();
  };
  const todo = selected.length;
  const inflight = isInflight();

  // show button as disabled when loading, and in the delay before we clean up.
  const buttonClass = inflight ? 'button--disabled' : '';
  const confirmTextArray = isArray(confirm) ? confirm : [confirm];
  const percentage = todo ? ((completed * 100) / todo).toFixed(2) : 0;

  return (
      <div>
        <AsyncCommand
          action={handleClick}
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
            onCancel={status ? cleanup : cancel}
            cancelButtonText={status ? 'Close' : 'Cancel'}
            onCloseModal={status ? cleanup : cancel}
            onConfirm={confirm}
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
};

BatchCommand.propTypes = {
  action: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  text: PropTypes.string,
  selected: PropTypes.array,
  className: PropTypes.string,
  clearError: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  confirm: PropTypes.func,
  confirmOptions: PropTypes.array,
  getModalOptions: PropTypes.func,
  history: PropTypes.object.isRequired,
};

export default withRouter(BatchCommand);
