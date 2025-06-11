import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DefaultModal from '../Modal/modal';

const NetworkErrorModal = ({
  title = 'Network Connection Error',
  children = 'Your network appears to be offline. To avoid redirection, please reconnect as some contents may become unavailable.',
}) => {
  const [modalVisible, setModalVisible] = useState(!navigator.onLine);
  const handleClose = () => setModalVisible(false);
  useEffect(() => {
    const updateStatus = () => {
      const offline = !navigator.onLine;
      setModalVisible(offline);
    };
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    const interval = setInterval(updateStatus, 300000); // check five minutes

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, []);

  return (
    <DefaultModal
    title={title}
    className="NetworkErrorModal"
    onCancel={handleClose}
    onCloseModal={handleClose}
    showModal={modalVisible}
    hasConfirmButton={false}
    hasCancelButton={true}
    cancelButtonText="Dismiss"
    >
        {children}
        </DefaultModal>
  );
};
NetworkErrorModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default NetworkErrorModal;
