import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { IDLE_TIMER_TOGGLE_MODAL, IDLE_TIMER_LAST_KEY_PRESS, IDLE_TIMER_LOGOUT_TIMER } from '../../actions/types';
import { idleTimerShowModal, idleTimerLastKeypress } from '../../actions/index';
// import DefaultModal from './modal';

const InactivityModal = ({
  showModal,
  lastKeyPress,
  logoutTimer
}) => {
  //   const [lastKeyPress, setLastKeyPress] = useState(Date.now());
  //   const [showModal, setShowModal] = useState(false);

  // Function to update the lastKeyPress time
  //   const handleKeyPress = () => {
  //     setLastKeyPress(Date.now());
  //     if (showModal) {
  //       setShowModal(false); // hide modal if user resumes activity
  //     }
  //   };

  function handleShowModal() {
    idleTimerShowModal();
  }

  function handleLastKeypress() {
    idleTimerLastKeypress();
  }

  // Effect to setup event listeners for keyboard activity
  useEffect(() => {
    window.addEventListener('keydown', handleLastKeypress);

    return () => {
      window.removeEventListener('keydown', handleLastKeypress);
    };
  }, []);
  // Dependencies array includes showModal to update listener when modal state changes

  // Effect to handle showing the modal after 30 minutes of inactivity
  useEffect(() => {
    // console.log('lastkp: ', state.lastKeyPress);
    // console.log('showmodal: ', state.showModal);
    const checkInactivity = setInterval(() => {
      if (Date.now() - lastKeyPress > 3000 && !showModal) {
        // 1800000 ms = 30 minutes
        handleShowModal(true);
      }
    }, 60000); // Check every minute (60000 ms)

    return () => clearInterval(checkInactivity);
  }, [showModal, lastKeyPress]);

  return (
    <div>
      {/* <DefaultModal
      title = {text}
      className='IAModal'
      onCancel={successModal ? success : cancel}
      onCloseModal={cancel}
      onConfirm={confirm}
      showModal={confirmModal || successModal}
      hasConfirmButton={!successModal}
      cancelButtonText={successModal ? 'Close' : 'Cancel'}
      /> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  showModal: state.showModal,
  lastKeyPress: state.lastKeyPress,
  logoutTimer: state.logoutTimer
});

InactivityModal.propTypes = {
  showModal: PropTypes.bool,
  lastKeyPress: PropTypes.string,
  logoutTimer: PropTypes.object
};

export default connect(mapStateToProps)(InactivityModal);
