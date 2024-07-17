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
  text,
  selected,
  className,
  clearError,
  onSuccess,
  onError,
  confirm,
  confirmOptions,
  getModalOptions,
  history,
}) => {
  const [callbacks, setCallbacks] = useState({});
  const [activeModal, setActiveModal] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [status, setStatus] = useState(null);
  const [modalOpts, setModalOpts] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [meta, setMeta] = useState({});
  const [results, setResults] = useState(null);
  const isRunning = useRef(false);

  const buildId = (item) => (typeof item === 'string' ? item : item.granuleId);

  const updateMeta = (newMeta) => {
    setMeta((prevMeta) => ({ ...prevMeta, ...newMeta }));
  };

  const closeModal = () => {
    setActiveModal(false);
    setMeta({});
  };

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    const handleCallbacks = () => {
      // on success or error, call and remove the saved callback
      Object.keys(callbacks).forEach((id) => {
        if (!state[id] || !callbacks[id]) return;
        if (state[id].status === 'success') callbacks[id](null, id);
        else if (state[id].status === 'error') { callbacks[id]({ error: state[id].error, id }); }

        if (state[id].status === 'success' || state[id].status === 'error') {
          const newCallbacks = { ...callbacks };
          delete newCallbacks[id];
          setCallbacks(newCallbacks);
          setCompleted((prevCompleted) => prevCompleted + 1);
        }
      });
      isRunning.current = false;
    };
    handleCallbacks();
  }, [state, callbacks]);

  const confirmAction = () => {
    if (typeof getModalOptions === 'function') {
      const modalOptions = getModalOptions({
        selected,
        history,
        isOnModalConfirm: true,
        isOnModalComplete: false,
        closeModal
      });
      setModalOpts(modalOptions);

      // if we're replacing the onConfirm function, we don't want to continue with the current one
      if (modalOptions.onConfirm) {
        return;
      }
    }
    if (!isInflight()) start();
  };

  const cancel = () => {
    // prevent cancel when inflight
    if (!isInflight()) setActiveModal(false);
  };

  const start = () => {
    // if we have inflight callbacks, don't allow further clicks
    if (!Array.isArray(selected) || !selected.length || isInflight()) { return false; }
    const q = queue(initAction, CONCURRENCY);
    selected.forEach((item) => {
      q.add(initAction, buildId(item));
    });
    q.done(onComplete);
  };

  // save a reference to the callback in state, then init the action
  const initAction = (id, callback) => {
    setCallbacks((prevCallbacks) => ({
      ...prevCallbacks,
      [id]: callback
    }));
    return dispatch(action(id, meta));
  };

  // immediately change the UI to show either success or error
  const onComplete = (errors) => {
    // turn array of errors from queue into single error for ui
    const errMsg = createErrorMessage(errors);
    setErrorMsg(errMsg);
    setStatus(errMsg ? 'error' : 'success');
    setResults(errors ? [] : selected.map((item) => buildId(item)));
    setTimeout(() => {
      if (typeof getModalOptions === 'function') {
        // setTimeout(() => {
        const modalOptions = getModalOptions({
          history,
          selected,
          results: selected.map((item) => buildId(item)),
          errors,
          errorMessage: errMsg,
          isOnModalComplete: true,
          closeModal
        });
        setModalOpts(modalOptions);
        setStatus(null);
      }
    }, 0);
  };

  // combine multiple errors into one
  const createErrorMessage = (errors) => {
    if (!errors || !errors.length) return null;
    return `${errors.length} error(s) occurred: \n${errors
      .map((err) => err.error.toString())
      .join('\n')}`;
  };

  // call onSuccess and onError functions as needed
  const cleanup = () => {
    if (errorMsg && typeof onError === 'function') onError(errorMsg);
    if (results && results.length && typeof onSuccess === 'function') { onSuccess(results, errorMsg); }
    if (typeof clearError === 'function') {
      selected.forEach((item) => dispatch(clearError(buildId(item))));
    }
    setActiveModal(false);
    setCompleted(0);
    setErrorMsg(null);
    setStatus(null);
    setResults(null);
  };

  const isInflight = () => !!Object.keys(callbacks).length;

  const handleClick = () => {
    if (typeof getModalOptions === 'function') {
      const modalOptions = getModalOptions({
        onChange: updateMeta,
        selected,
        history,
        closeModal
      });
      setModalOpts(modalOptions);
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
  const confirmResult = confirm(todo);
  const confirmTextArray = isArray(confirmResult) ? confirmResult : [confirmResult];
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
            onConfirm={confirmAction}
            title={text}
            showModal={activeModal}
            confirmButtonClass={`${buttonClass} button--submit`}
            cancelButtonClass={`${buttonClass} button--cancel`}
            hasConfirmButton={!status} /* if status is set, we just want to close the modal */
            {...modalOpts}
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
                <ErrorReport report={errorMsg} />
              </div>
            </>
            }
            {!inflight && !status && (!modalOpts || !modalOpts.children) && (
              <>
                <div>{confirmTextArray.map((confirmText, index) => (
                  <React.Fragment key={index}>
                    {confirmText}
                  </React.Fragment>
                ))}</div>
                <div className="modal__internal modal__formcenter">
                  {confirmOptions &&
                    confirmOptions.map((option, index) => (
                      <div key={`option-${index}`}>
                        {option}
                        <br />
                      </div>))
                  }
                </div>
              </>
            )}
            {modalOpts && modalOpts.children}
          </DefaultModal>
        </div>
      </div>
  );
};

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
