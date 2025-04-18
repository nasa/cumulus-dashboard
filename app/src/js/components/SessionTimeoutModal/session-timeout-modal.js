import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { decode as jwtDecode } from 'jsonwebtoken';
import DefaultModal from '../Modal/modal';
import { logout } from '../../actions';

const SessionTimeoutModal = ({
  tokenExpiration,
  title = 'Session Expiration Warning',
  children = 'Your session will expire in 5 minutes. Please re-login if you would like to stay signed in.',
  dispatch,
}) => {
  const [hasModal, setHasModal] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);

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
    const interval = setInterval(() => {
      if (!tokenExpiration || hasModal || modalClosed) {
        return;
      }

      const currentTime = Math.ceil(Date.now() / 1000);
      const secondsLeft = tokenExpiration - currentTime;

      if (secondsLeft <= 300) {
        setHasModal(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiration, hasModal, modalClosed]);

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
      confirmButtonText="Refresh"
    >
      {children}
    </DefaultModal>
  );
};

SessionTimeoutModal.propTypes = {
  tokenExpiration: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.string,
  dispatch: PropTypes.func,
};

export default connect((state) => {
  const token = get(state, 'api.tokens.token');
  const jwtData = token ? jwtDecode(token) : null;
  const tokenExpiration = get(jwtData, 'exp');

  return { tokenExpiration };
})(SessionTimeoutModal);
