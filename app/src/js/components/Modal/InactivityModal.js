import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { IDLE_TIMER_TOGGLE_MODAL, IDLE_TIMER_LAST_KEY_PRESS, IDLE_TIMER_LOGOUT_TIMER } from '../../actions/types';
// import { idleTimerShowModal, idleTimerLastKeypress } from '../../actions/index';
import get from 'lodash/get';
import DefaultModal from './modal';
// import OAuth from '../oauth';
import { logout } from '../../actions';

const InactivityModal = ({
  text = 'Session Timeout Warning',
  children = `We have noticed that you have been inactive for a while.
  We will close this session in 5 minutes. If you want to stay signed in, select ‘Continue Session’.`,
  showModal,
  onConfirm,
  onCloseModal,
  onCancel,
  dispatch
}) => {
  const [lastKeyPress, setLastKeyPress] = useState(Date.now());
  const [hasModal, setHasModal] = useState(true);
  // const isLoggedIn = () => store.getState().api.authenticated;

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

  // Effect to handle showing the modal after 30 minutes of inactivity
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (Date.now() - lastKeyPress > 1800000 && !hasModal) { // 1800000 ms = 30 minutes
        setHasModal(true);
      }
    }, 60000); // Check every minute (60000 ms)

    return () => clearInterval(checkInactivity);
  }, [hasModal, lastKeyPress]);

  return (
    <div>
      <DefaultModal
      title = {text}
      className='IAModal'
      onCancel={handleLogout}
      onCloseModal={closeModal}
      onConfirm={handleConfirm}
      showModal={hasModal}
      hasConfirmButton={hasModal}
      cancelButtonText='Cancel'
      confirmButtonText='Continue'
      children = {children}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  hasModal: state.hasModal,
  lastKeyPress: state.lastKeyPress,
  logoutTimer: state.logoutTimer
});

InactivityModal.propTypes = {
  hasModal: PropTypes.bool,
  lastKeyPress: PropTypes.string,
  logoutTimer: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  text: PropTypes.string,
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

export default connect(mapStateToProps)(InactivityModal);
