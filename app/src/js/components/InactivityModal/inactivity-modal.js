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

  const EXPIRATION_THRESHOLD = 1000000;
  // const CHECK_INTERVAL = 1000;

  const handleLogout = useCallback(() => {
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }, [dispatch]);

  const handleConfirm = () => {
    setHasModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);

      const secondsLeft = tokenExpiration - currentTime;

      if (secondsLeft <= TIME_THRESHOLD && secondsLeft > 0 && !hasModal) {
        setHasModal(true);
      }

      if (secondsLeft <= 0 && hasModal) {
        handleLogout();
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [tokenExpiration, hasModal, handleLogout]);

  return (
    <DefaultModal
      title={title}
      className='IAModal'
      onCancel={handleLogout}
      onCloseModal={() => setHasModal(false)}
      onConfirm={handleConfirm}
      showModal={hasModal}
      hasConfirmButton={true}
      hasCancelButton={true}
      cancelButtonText='Log Out'
      confirmButtonText='Continue Session'
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
  const tokenExpiration = get(jwtData, 'exp'); // UNIX seconds

  return {
    tokenExpiration,
  };
};

export default connect(mapStateToProps)(LaunchpadExpirationWarningModal);
