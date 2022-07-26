/** Will need to review: Modal needs to be put into its own component and link the actions to that component as well
 *  as ButtonGroup aka bulkactions
 *  For Delete Collection Modal (later other modals): Need to copy logic from here and implement in
 *  AsyncDeleteCollectionModal.js
*/
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { preventDefault } from '../../utils/noop';
import DefaultModal from '../Modal/modal';
import Ellipsis from '../LoadingEllipsis/loading-ellipsis';

const AsyncCommand = ({
  action,
  className,
  confirmAction,
  confirmText,
  confirmOptions,
  hidden,
  element = 'button',
  error,
  postActionText,
  status,
  success,
  text,
}) => {
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const inflight = status === 'inflight';
  const props = {
    className: element !== 'button' ? elementClass(inflight) : buttonClass(inflight),
    onClick: hidden ? preventDefault : handleClick
  };
  if (element === 'a') props.href = '#';
  const children = (
    <span>
      {text}{inflight && <Ellipsis />}
    </span>
  );
  const button = React.createElement(element, props, children);
  const prevStatusRef = useRef();

  useEffect(() => {
    const prevStatusInflight = prevStatusRef.current === 'inflight';
    if (prevStatusInflight && status === 'success') {
      setSuccessModal(true);
    } else if (prevStatusInflight && status === 'error' && typeof error === 'function') {
      error();
    }
  }, [error, status]);

  useEffect(() => {
    prevStatusRef.current = status;
  });

  function buttonClass (processing) {
    return [
      'button button--small form-group__element',
      `${processing ? 'button--loading' : ''}`,
      `${hidden ? 'button--hidden' : ''}`,
      `${className || 'button__group'}`
    ].join(' ');
  }

  // a generic className generator for non-button elements
  function elementClass (processing) {
    let newClassName = 'async__element';
    if (processing) newClassName += ' async__element--loading';
    if (hidden) newClassName += ' async__element--disabled';
    if (className) newClassName += ` ${className}`;
    return newClassName;
  }

  function handleClick (e) {
    e.preventDefault();
    if (confirmAction) {
      setConfirmModal(true);
    } else if (status !== 'inflight' && !hidden) {
      // prevent duplicate action if the action is already inflight.
      action();
    }
  }

  function confirm () {
    action();
    setConfirmModal(false);
    if (status === 'success') setSuccessModal(true);
  }

  function cancel () {
    setConfirmModal(false);
    setSuccessModal(false);
  }
  return (
    <div>
      { button }
      <DefaultModal
        title = {text}
        className='async__modal'
        onCancel={successModal ? success : cancel}
        onCloseModal={cancel}
        onConfirm={confirm}
        showModal={confirmModal || successModal}
        hasConfirmButton={!successModal}
        cancelButtonText={successModal ? 'Close' : 'Cancel'}
      >
        {confirmModal && <div className='modal__internal modal__formcenter'>
          { confirmOptions && (confirmOptions).map((option) => <div key={`option-${confirmOptions.indexOf(option)}`}>
            {option}
            <br />
          </div>)}
          <p>{confirmText}</p>
        </div>}
        {successModal &&
        <>
          <Alert variant='success'>Success! {postActionText}</Alert>
          <CircularProgressbarWithChildren background="true" className="success" strokeWidth="2" value={100}>
            <FontAwesomeIcon icon={faCheck} />
          </CircularProgressbarWithChildren>
        </>
        }
      </DefaultModal>
    </div>
  );
};

AsyncCommand.propTypes = {
  action: PropTypes.func,
  success: PropTypes.func,
  error: PropTypes.func,
  status: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  hidden: PropTypes.bool,
  element: PropTypes.string,
  confirmAction: PropTypes.bool,
  confirmText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  confirmOptions: PropTypes.array,
  postActionText: PropTypes.string
};

export default AsyncCommand;
