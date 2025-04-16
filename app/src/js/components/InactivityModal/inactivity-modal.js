import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { decode as jwtDecode } from 'jsonwebtoken';
import DefaultModal from '../Modal/modal';
import { logout } from '../../actions';

const LaunchpadExpirationWarningModal = ({
  tokenExpiration,
  title = 'Session Expiration Warning',
  children = 'Your session will expire in 5 minutes. Please re-login if you would like to stay signed in.',
  dispatch,
}) => {
  const [hasModal, setHasModal] = useState(false);
  const [modalClose, setModalClose] = useState(false);

  const handleLogout = useCallback(() => {
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }, [dispatch]);

  const handleConfirm = () => {
    setHasModal(false);
    setModalClose(true);
  };

  const handleClose = () => {
    setHasModal(false);
    setModalClose(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!tokenExpiration || hasModal || modalClose) {
        return;
      }

      const currentTime = Math.ceil(Date.now() / 1000);
      const secondsLeft = tokenExpiration - currentTime;

      if (secondsLeft <= 300) {
        setHasModal(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiration, hasModal, modalClose]);

  return (
    <DefaultModal
      title={title}
      className="LaunchpadExpirationModal"
      onCancel={handleLogout}
      onCloseModal={handleClose}
      onConfirm={handleConfirm}
      showModal={hasModal}
      hasConfirmButton={true}
      hasCancelButton={true}
      cancelButtonText="Log Out"
      confirmButtonText="Close"
    >
      {children}
    </DefaultModal>
  );
};

LaunchpadExpirationWarningModal.propTypes = {
  tokenExpiration: PropTypes.number.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const token = get(state, 'api.tokens.token');
  const jwtData = token ? jwtDecode(token) : null;
  const tokenExpiration = get(jwtData, 'exp');

  return { tokenExpiration };
};

export default connect(mapStateToProps)(LaunchpadExpirationWarningModal);
