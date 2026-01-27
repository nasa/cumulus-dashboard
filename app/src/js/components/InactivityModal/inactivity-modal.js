import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import DefaultModal from '../Modal/modal';
import { logout } from '../../actions';
import { window } from '../../utils/browser';
import _config from '../../config';

const InactivityModal = ({
  title = 'Inactivity Warning',
  children = 'You have been inactive for a while. Move your cursor or press a key to continue using the application. If no action is taken, you will be logged out.',
  dispatch,
  token,
}) => {
  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef(null);
  const logoutTimerRef = useRef(null);

  const handleLogout = useCallback(() => {
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }, [dispatch]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const resetActivity = useCallback(() => {
    if (!token) return;

    setIsInactive(false);
    clearTimers();

    // Set timer for inactivity warning (15 minutes)
    timerRef.current = setTimeout(() => {
      setIsInactive(true);

      // Set timer for logout (5 more minutes = 20 minutes total)
      logoutTimerRef.current = setTimeout(() => {
        handleLogout();
      }, _config.inactivityLogoutLimit - _config.inactivityWarningLimit);
    }, _config.inactivityWarningLimit);
  }, [token, handleLogout, clearTimers]);

  const handleClose = useCallback(() => {
    resetActivity();
  }, [resetActivity]);

  useEffect(() => {
    if (!token) {
      clearTimers();
      setIsInactive(false);
      return;
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetActivity));

    // Start the timer initially
    resetActivity();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetActivity));
      clearTimers();
    };
  }, [token, resetActivity, clearTimers]);

  if (!token) return null;

  return (
    <DefaultModal
      data-Id="inactivity-modal"
      title={title}
      className="InactivityModal"
      onCancel={handleClose}
      onCloseModal={handleClose}
      showModal={isInactive}
      hasConfirmButton={false}
      hasCancelButton={true}
      cancelButtonText="Stay logged in"
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
