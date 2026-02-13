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
  const [modalClosed, setModalClosed] = useState(false);
  // 'sessionCapReached', 'sessionCapWarning', 'tokenExpired', 'tokenExpiringWarning'
  const [modalReason, setModalReason] = useState(null);
  const refreshAttemptedRef = useRef(false);

  console.log('[SessionTimeoutModal] Component rendered. Token exists:', !!token, 'tokenExpiration:', tokenExpiration, 'mockTokenExpiration:', _config.mockTokenExpiration);

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
    setModalClosed(true);
  };

  useEffect(() => {
    // Reset modalClosed when token changes (new session)
    if (token) {
      setModalClosed(false);
      setModalReason(null);
      refreshAttemptedRef.current = false;
    }
  }, [token]);

  useEffect(() => {
    const checkTimeout = () => {
      if (!tokenExpiration || !token || modalClosed) {
        return;
      }

      // Allow mocking token expiration for testing
      const effectiveTokenExpiration = _config.mockTokenExpiration
        ? parseInt(_config.mockTokenExpiration, 10)
        : tokenExpiration;

      const currentTime = Math.ceil(Date.now() / 1000);
      const tokenSecondsLeft = effectiveTokenExpiration - currentTime;
      // Get session start from token's iat claim
      const sessionStart = getSessionStart(token);
      const sessionDuration = sessionStart ? Date.now() - sessionStart : 0;
      const sessionCapReached = sessionDuration > _config.maxSessionDuration;
      const timeUntilSessionCapMs = _config.maxSessionDuration - sessionDuration;
      const timeUntilSessionCapSeconds = timeUntilSessionCapMs / 1000;
      const sessionCapWillBeReachedSoon = timeUntilSessionCapSeconds <= _config.sessionWarningThreshold &&
        timeUntilSessionCapSeconds > 0;
      console.log(`[SessionTimeoutModal] tokenSecondsLeft: ${tokenSecondsLeft}, sessionDuration: ${(sessionDuration / 1000).toFixed(1)}s, sessionCapReached: ${sessionCapReached}, timeUntilSessionCap: ${timeUntilSessionCapSeconds.toFixed(1)}s, threshold: ${_config.sessionWarningThreshold}`);

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

      // If session cap will be reached soon, show warning modal (only once)
      if (sessionCapWillBeReachedSoon && !hasModal) {
        console.log(`[SessionTimeoutModal] Session cap warning: will be reached in ${timeUntilSessionCapSeconds.toFixed(1)}s, token expires in ${tokenSecondsLeft}s`);
        setModalReason('sessionCapWarning');
        setHasModal(true);
        return;
      }

      // If token has already expired (always update modal reason even if already showing)
      if (tokenSecondsLeft <= 0) {
        if (modalReason !== 'tokenExpired') {
          console.log(`[SessionTimeoutModal] Token expired! Session duration: ${(sessionDuration / 1000).toFixed(1)}s`);
          setModalReason('tokenExpired');
        }
        if (!hasModal) {
          setHasModal(true);
        }
        return;
      }

      // If token is expiring soon (but not expired yet)
      if (tokenSecondsLeft <= _config.sessionWarningThreshold && tokenSecondsLeft > 0) {
        // If session cap not reached, auto-refresh
        // Note: Inactivity is handled separately by InactivityModal
        if (!sessionCapReached && !refreshAttemptedRef.current && !hasModal) {
          console.log(`[SessionTimeoutModal] Token expiring warning: will expire in ${tokenSecondsLeft}s, session duration: ${(sessionDuration / 1000).toFixed(1)}s`);
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
    const interval = setInterval(checkTimeout, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiration, token, hasModal, modalClosed, dispatch, handleLogout, modalReason]);

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
      backdrop={!(modalReason === 'sessionCapReached' || modalReason === 'tokenExpired')}
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
