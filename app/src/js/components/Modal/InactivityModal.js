import React, { useState, useEffect } from 'react';

const InactivityModal = () => {
    const [lastKeyPress, setLastKeyPress] = useState(Date.now());
    const [showModal, setShowModal] = useState(false);

    // Function to update the lastKeyPress time
    const handleKeyPress = () => {
        setLastKeyPress(Date.now());
        if (showModal) {
            setShowModal(false); // hide modal if user resumes activity
        }
    };

    // Effect to setup event listeners for keyboard activity
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [showModal]);  // Dependencies array includes showModal to update listener when modal state changes

    // Effect to handle showing the modal after 30 minutes of inactivity
    useEffect(() => {
        const checkInactivity = setInterval(() => {
            if (Date.now() - lastKeyPress > 1800000 && !showModal) {  // 1800000 ms = 30 minutes
                setShowModal(true);
            }
        }, 60000);  // Check every minute (60000 ms)

        return () => clearInterval(checkInactivity);
    }, [lastKeyPress, showModal]);

    return (
        <div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Session Timeout Warning</h2>
                        <p>Your session will end after 5 minutes of inactivity.</p>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InactivityModal;
