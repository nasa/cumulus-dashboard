import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { decode as jwtDecode } from 'jsonwebtoken';
import DefaultModal from '../Modal/modal';
import { logout, refreshAccessToken } from '../../actions';
import { window } from '../../utils/browser';
import { getSessionStart } from '../../utils/auth';
import _config from '../../config';

const SESSION_WARNING_THRESHOLD = 300; // 5 minutes in seconds
const MAX_SESSION_DURATION = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

const SessionTimeoutModal = ({
  token,
  tokenExpiration,
  title = 'Session Expiration Warning',
  children = 'Your session will expire in 5 minutes. Please re-login if you would like to stay signed in.',
  dispatch,
}) => {
  const [hasModal, setHasModal] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const refreshAttemptedRef = useRef(false);

  const handleLogout = useCallback(() => {
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }, [dispatch]);

  const handleClose = () => {
    setHasModal(false);
    setModalClosed(true);
  };

  useEffect(() => {
    // Reset modalClosed when token changes (new session)
    if (token) {
      setModalClosed(false);
      refreshAttemptedRef.current = false;
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!tokenExpiration || !token || modalClosed) {
        return;
      }

      // Allow mocking token expiration for testing
      const effectiveTokenExpiration = _config.mockTokenExpiration 
        ? parseInt(_config.mockTokenExpiration, 10) 
        : tokenExpiration;

      const currentTime = Math.ceil(Date.now() / 1000);
      const secondsLeft = effectiveTokenExpiration - currentTime;
      
      // Get session start from token's iat claim
      const sessionStart = getSessionStart(token);
      const sessionDuration = sessionStart ? Date.now() - sessionStart : 0;
      const sessionCapReached = sessionDuration > MAX_SESSION_DURATION;

      // If token has already expired and session cap reached, just log out
      if (secondsLeft <= 0 && sessionCapReached) {
        handleLogout();
        return;
      }

      // If token is expiring soon (but not expired yet)
      if (secondsLeft <= SESSION_WARNING_THRESHOLD && secondsLeft > 0) {
        // If session cap not reached, auto-refresh
        // Note: Inactivity is handled separately by InactivityModal
        if (!sessionCapReached && !refreshAttemptedRef.current && !hasModal) {
          refreshAttemptedRef.current = true;
          dispatch(refreshAccessToken(token))
            .then(() => {
              // Reset the flag after successful refresh
              refreshAttemptedRef.current = false;
            })
            .catch(() => {
              // If refresh fails, show the modal
              setHasModal(true);
            });
        } else if (sessionCapReached && !hasModal) {
          // If session cap reached but token still valid, show modal to give user a chance to re-login
          setHasModal(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiration, token, hasModal, modalClosed, dispatch, handleLogout]);

  return (
    <DefaultModal
      title={title}
      className="SessionTimeoutModal"
      onCancel={handleClose}
      onCloseModal={handleClose}
      onConfirm={handleLogout}
      showModal={hasModal}
      hasConfirmButton={true}
      hasCancelButton={true}
      cancelButtonText="Dismiss"
      confirmButtonText="Re-login"
    >
      {children}
    </DefaultModal>
  );
};

SessionTimeoutModal.propTypes = {
  token: PropTypes.string,
  tokenExpiration: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.string,
  dispatch: PropTypes.func,
};

export default connect((state) => {
  const token = get(state, 'api.tokens.token');
  const jwtData = token ? jwtDecode(token) : null;
  const tokenExpiration = get(jwtData, 'exp');

  return { token, tokenExpiration };
})(SessionTimeoutModal);
