import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import DefaultModal from '../Modal/modal';
import { logout } from '../../actions';

export const INACTIVITY_LIMIT = 300000; // 5 minutes in milliseconds
export const MODAL_TIMEOUT = 120000; // 2 minutes in milliseconds

const InactivityModal = ({
  title = 'Inactivity Warning',
  children = 'You have been inactive for a while. Move your cursor or press a key to continue using the application. If no action is taken, you will be logged out.',
  dispatch,
}) => {
  const [hasModal, setHasModal] = useState(false);
  const timerRef = useRef(null);
  const modalTimeoutRef = useRef(null);

  const handleLogout = useCallback(() => {
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }, [dispatch]);

  const handleClose = () => {
    setHasModal(false);
    clearTimeout(timerRef.current);
    clearTimeout(modalTimeoutRef.current);
  };

  const resetTimer = useCallback(() => {
    setHasModal(false);
    clearTimeout(timerRef.current);
    clearTimeout(modalTimeoutRef.current);
    timerRef.current = setTimeout(() => {
      setHasModal(true);
      modalTimeoutRef.current = setTimeout(() => {
        handleLogout();
      }, MODAL_TIMEOUT); // Logout after modal timeout
    }, INACTIVITY_LIMIT); // Show modal after 5 minutes of inactivity
  }, [handleLogout]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearTimeout(timerRef.current);
      clearTimeout(modalTimeoutRef.current);
    };
  }, [handleActivity, resetTimer]);

  return (
    <DefaultModal
      data-Id="inactivity-modal"
      title={title}
      className="InactivityModal"
      onCancel={handleClose}
      onCloseModal={handleClose}
      showModal={hasModal}
      hasConfirmButton={false}
      hasCancelButton={false}
      >
        {children}
        </DefaultModal>
  );
};

InactivityModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.string,
  dispatch: PropTypes.func,
};

export default connect((state) => ({
  token: get(state, 'api.tokens.token'),
}))(InactivityModal);
