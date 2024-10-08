import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import DefaultModal from './modal';
import { logout } from '../../actions';

const InactivityModal = ({
  title = 'Session Timeout Warning',
  children = `We have noticed that you have been inactive for a while.
  We will close this session in 5 minutes. If you want to stay signed in, select ‘Continue Session’.`,
  dispatch
}) => {
  const [lastKeyPress, setLastKeyPress] = useState(Date.now());
  const [hasModal, setHasModal] = useState(false);

  const inactivityTimeInterval = 1800000; // 1800000 ms = 30 min
  const timeToCheckInterval = 60000; // Check every minute, 60000 ms = 1 min
  // const timeToLogout = 300000; // force logout after interval, 300000 ms = 5 min

  function handleConfirm() {
    setLastKeyPress(Date.now());
    closeModal();
  }

  const handleLogout = useCallback(() => {
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }, [dispatch]);

  function closeModal() { // the X botton
    setLastKeyPress(Date.now());
    if (hasModal) {
      setHasModal(false); // hide modal if user resumes activity
    }
  }

  // Effect to setup event listeners for keyboard activity
  useEffect(() => {
    // Function to update the lastKeyPress time
    const handleKeypress = () => {
      setLastKeyPress(Date.now());
      if (hasModal) {
        setHasModal(false); // hide modal if user resumes activity
      }
    };
    window.addEventListener('keydown', handleKeypress);

    return () => {
      window.removeEventListener('keydown', handleKeypress);
    };
  }, [hasModal]);

  // Effect to handle showing the modal after <inactivityTimeInterval> of inactivity
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (Date.now() - lastKeyPress > inactivityTimeInterval && !hasModal) {
        setHasModal(true);
      }
    }, timeToCheckInterval);

    return () => clearInterval(checkInactivity);
  }, [hasModal, lastKeyPress]);

  return (
    <div>
      <DefaultModal
      title = {title}
      className='IAModal'
      onCancel={handleLogout}
      onCloseModal={closeModal}
      onConfirm={handleConfirm}
      showModal={hasModal}
      hasConfirmButton={true}
      hasCancelButton={true}
      cancelButtonText='Close Session'
      confirmButtonText='Continue Session'
      children = {children}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  hasModal: state.hasModal,
  lastKeyPress: state.lastKeyPress,
});

InactivityModal.propTypes = {
  hasModal: PropTypes.bool,
  lastKeyPress: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.string,
  className: PropTypes.string,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  showModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  hasCancelButton: PropTypes.bool,
  hasConfirmButton: PropTypes.bool,
  dispatch: PropTypes.func,
};

export { InactivityModal };

export default connect(mapStateToProps)(InactivityModal);
