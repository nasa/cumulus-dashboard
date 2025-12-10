import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { decode as jwtDecode } from 'jsonwebtoken';
import DefaultModal from '../Modal/modal';
import { logout, refreshAccessToken } from '../../actions';

export const INACTIVITY_LIMIT = 900000; // 15 minutes in milliseconds
export const MODAL_TIMEOUT = 300000; // 5 minutes in milliseconds

const InactivityModal = ({
  title = 'Inactivity Warning',
  children = 'You have been inactive for a while. Move your cursor or press a key to continue using the application. If no action is taken, you will be logged out.',
  dispatch,
  token,
}) => {
  const [hasModal, setHasModal] = useState(false);
  const timerRef = useRef(null);
  const modalTimeoutRef = useRef(null);

  const clearTimers = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(modalTimeoutRef.current);
  }, []);

  const handleLogout = useCallback(() => {
    clearTimers();
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }, [dispatch, clearTimers]);

  const handleClose = useCallback(() => {
    setHasModal(false);
    clearTimers();
  }, [clearTimers]);

  const resetTimer = useCallback(() => {
    if (!token) return;

    setHasModal(false);
    clearTimers();

    timerRef.current = setTimeout(() => {
      setHasModal(true);
      modalTimeoutRef.current = setTimeout(() => {
        handleLogout();
      }, MODAL_TIMEOUT); // Logout after modal timeout
    }, INACTIVITY_LIMIT); // Show modal after 5 minutes of inactivity
  }, [handleLogout, clearTimers, token]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!token) {
      clearTimers();
      setHasModal(false);
      return;
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearTimers();
    };
  }, [handleActivity, resetTimer, token, clearTimers]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token || hasModal) return;

      const jwtData = jwtDecode(token);
      const tokenExpiration = get(jwtData, 'exp');
      const currentTime = Math.ceil(Date.now() / 1000);

      // Refresh if token expires in less than 25 minutes
      if (tokenExpiration && (tokenExpiration - currentTime <= 1500)) {
        dispatch(refreshAccessToken(token));
      }
    };

    const interval = setInterval(checkTokenExpiration, 20 * 60 * 1000);
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, [token, hasModal, dispatch]);

  if (!token) return null;

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
  token: PropTypes.string,
};

export default connect((state) => ({
  token: get(state, 'api.tokens.token'),
}))(InactivityModal);
