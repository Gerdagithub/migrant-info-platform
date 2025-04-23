import React, { useState, useEffect } from 'react';
import chatbotAvatar from '../../assets/images/chatbot-logo.png';
import './ChatbotPopover.css';

const ChatbotPopover = () => {
  const [showPopover, setShowPopover] = useState(false);

useEffect(() => {
	const timer = setTimeout(() => {
		setShowPopover(true);
	}, 1000); // delay by 1 second

	return () => clearTimeout(timer);
}, []);
  

  const handleClose = () => {
    setShowPopover(false);
  };

  return (
    showPopover && (
      <div className="chatbot-popover">
        <img src={chatbotAvatar} alt="Tomas avatar" className="chatbot-avatar-popover" />
        <div className="chatbot-message">
          <p><strong>Hi, I'm Tomas!</strong><br />I can help with taxes, health, residency, and work in Lithuania. Just ask me anything!</p>
        </div>
        <button className="popover-close" onClick={handleClose}>✕</button>
      </div>
    )
  );
};

export default ChatbotPopover;
