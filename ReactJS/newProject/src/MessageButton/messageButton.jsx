import React, { useEffect, useState } from 'react';
import IconButton from '../MessageButton/iconButton.png';
import MessageForm from './messageForm';
const MessageButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('loggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <>
            <div className="fixed bottom-5 left-5 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-50 " onClick={handleButtonClick}>
                <img src={IconButton} alt="Icon" className="w-6 h-6" />
            </div>
            <MessageForm show={showModal} onClose={handleCloseModal} />
        </>
    );
};

export default MessageButton;