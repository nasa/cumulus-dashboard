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

const SessionTimeoutModal = ({
  token,
  tokenExpiration,
  title = 'Session Expiration Warning',
  children = 'Your session will expire in 5 minutes. Please re-login if you would like to stay signed in.',
  dispatch,
}) => {
  const [hasModal, setHasModal] = useState(false);
  // 'sessionCapReached', 'sessionCapWarning', 'tokenExpired', 'tokenExpiringWarning'
  const [modalReason, setModalReason] = useState(null);
  const modalClosedRef = useRef(false);
  const refreshAttemptedRef = useRef(false);

  console.log('[SessionTimeoutModal] Component rendered. Token exists:', !!token, 'tokenExpiration:', tokenExpiration, 'mockTokenExpirationSeconds:', _config.mockTokenExpirationSeconds);

  // Get message content based on reason for showing modal
  const getModalContent = (reason) => {
    switch (reason) {
      case 'sessionCapReached':
        return {
          title: 'Maximum Session Duration Reached',
          message: 'Your session has reached its maximum duration. Please re-login to continue.'
        };
      case 'sessionCapWarning':
        return {
          title: 'Session Duration Warning',
          message: 'Your session is approaching its maximum duration. Please re-login if you would like to continue.'
        };
      case 'tokenExpired':
        return {
          title: 'Session Expired',
          message: 'Your authentication token has expired. Please re-login to continue.'
        };
      case 'tokenExpiringWarning':
        return {
          title: 'Session Expiration Warning',
          message: 'Your session will expire in 5 minutes. Please re-login if you would like to stay signed in.'
        };
      default:
        return {
          title: 'Session Expiration Warning',
          message: 'Your session will expire soon. Please re-login if you would like to stay signed in.'
        };
    }
  };

  const handleLogout = useCallback(async () => {
    console.log('[SessionTimeoutModal] handleLogout called');
    try {
      await dispatch(logout());
    } catch (e) {
      console.error('[SessionTimeoutModal] Logout error:', e);
    }
    try {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    } catch (e) {
      // Ignore reload errors in test environments
    }
  }, [dispatch]);

  const handleClose = () => {
    setHasModal(false);
    modalClosedRef.current = true;
  };

  useEffect(() => {
    // Reset modalClosed flag when token changes (new session)
    if (token) {
      modalClosedRef.current = false;
      setModalReason(null);
      refreshAttemptedRef.current = false;
    }
  }, [token]);

  useEffect(() => {
    const checkTimeout = () => {
      if (!tokenExpiration || !token) {
        return;
      }

      // Allow mocking token expiration for testing
      const effectiveTokenExpiration = _config.mockTokenExpirationSeconds
        ? parseInt(_config.mockTokenExpirationSeconds, 10)
        : tokenExpiration;

      const currentTime = Math.ceil(Date.now() / 1000);
      const tokenSecondsLeft = effectiveTokenExpiration - currentTime;
      // Get session start from token's iat claim (in seconds since Unix epoch)
      const sessionStartSeconds = getSessionStart(token);
      const sessionDurationSeconds = sessionStartSeconds ? Math.ceil(Date.now() / 1000) - sessionStartSeconds : 0;
      const sessionCapReached = sessionDurationSeconds > _config.maxSessionDurationSeconds;
      const timeUntilSessionCapSeconds = _config.maxSessionDurationSeconds - sessionDurationSeconds;
      const sessionCapWillBeReachedSoon = timeUntilSessionCapSeconds <= _config.sessionWarningThresholdSeconds &&
        timeUntilSessionCapSeconds > 0;
      console.log(`[SessionTimeoutModal] tokenSecondsLeft: ${tokenSecondsLeft}, sessionDuration: ${sessionDurationSeconds}s, sessionCapReached: ${sessionCapReached}, timeUntilSessionCap: ${timeUntilSessionCapSeconds}s, threshold: ${_config.sessionWarningThresholdSeconds}`);

      // If session cap is reached (always update modal reason even if already showing)
      if (sessionCapReached) {
        if (modalReason !== 'sessionCapReached') {
          console.log(`[SessionTimeoutModal] Session cap reached! Token expires in ${tokenSecondsLeft}s`);
          setModalReason('sessionCapReached');
        }
        if (!hasModal) {
          setHasModal(true);
        }
        return;
      }

      // If session cap will be reached soon, show warning modal (only once, unless dismissed)
      if (sessionCapWillBeReachedSoon && !hasModal && !modalClosedRef.current) {
        console.log(`[SessionTimeoutModal] Session cap warning: will be reached in ${timeUntilSessionCapSeconds}s, token expires in ${tokenSecondsLeft}s`);
        setModalReason('sessionCapWarning');
        setHasModal(true);
        return;
      }

      // If token has already expired (always update modal reason even if already showing)
      if (tokenSecondsLeft <= 0) {
        if (modalReason !== 'tokenExpired') {
          console.log(`[SessionTimeoutModal] Token expired! Session duration: ${sessionDurationSeconds}s`);
          setModalReason('tokenExpired');
        }
        if (!hasModal) {
          setHasModal(true);
        }
        return;
      }

      // If token is expiring soon (but not expired yet)
      if (tokenSecondsLeft <= _config.sessionWarningThresholdSeconds && tokenSecondsLeft > 0) {
        // If session cap not reached, auto-refresh
        // Note: Inactivity is handled separately by InactivityModal
        if (!sessionCapReached && !refreshAttemptedRef.current && !hasModal && !modalClosedRef.current) {
          console.log(`[SessionTimeoutModal] Token expiring warning: will expire in ${tokenSecondsLeft}s, session duration: ${sessionDurationSeconds}s`);
          refreshAttemptedRef.current = true;
          dispatch(refreshAccessToken(token))
            .then(() => {
              refreshAttemptedRef.current = false;
            })
            .catch((error) => {
              // If refresh fails, show the modal with warning reason
              console.error('[SessionTimeoutModal] Auto-refresh failed:', error);
              setModalReason('tokenExpiringWarning');
              setHasModal(true);
            });
        }
      }
    };

    checkTimeout();
    const interval = setInterval(checkTimeout, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [tokenExpiration, token, hasModal, dispatch, handleLogout, modalReason]);

  const modalContent = getModalContent(modalReason);

  return (
    <DefaultModal
      title={modalContent.title}
      className="SessionTimeoutModal"
      onCancel={handleClose}
      onCloseModal={handleClose}
      onConfirm={handleLogout}
      showModal={hasModal}
      hasConfirmButton={true}
      hasCancelButton={modalReason !== 'sessionCapReached' && modalReason !== 'tokenExpired'}
      cancelButtonText="Dismiss"
      confirmButtonText="Re-login"
      animation={process.env.NODE_ENV !== 'test'}
      // don't allow user to dismiss modal by clicking on backdrop if session cap is reached or token expired
      backdrop={(modalReason === 'sessionCapReached' || modalReason === 'tokenExpired') ? 'static' : true}
      closeButton={modalReason !== 'sessionCapReached' && modalReason !== 'tokenExpired'}
    >
      {modalContent.message}
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
