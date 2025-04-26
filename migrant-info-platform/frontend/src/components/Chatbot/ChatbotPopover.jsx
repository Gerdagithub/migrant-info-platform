import React, { useState, useEffect, useRef } from 'react';
import chatbotAvatar from '../../assets/images/chatbot-logo.png';
import './ChatbotPopover.css';

const ChatbotPopover = () => {
  const pathname = window.location.pathname;
  const isHomePage = pathname === '/';

  const [showPopover, setShowPopover] = useState(false);
  const hasShown = useRef(false);
  const timerId = useRef(null);

  useEffect(() => {
    // Reset on each page load or navigation
    hasShown.current = false;
    setShowPopover(false);

    // Delay: 1s on homepage, 30s on other pages
    const delay = isHomePage ? 1000 : 30000;

    const startTimer = () => {
      if (hasShown.current) return;
      clearTimeout(timerId.current);
      timerId.current = setTimeout(() => {
        setShowPopover(true);
        hasShown.current = true;
      }, delay);
    };

    // Start the initial timer
    startTimer();

    if (!isHomePage) {
      // On non-home pages, reset timer on user activity
      const events = ['mousemove', 'keydown', 'scroll', 'mousedown', 'touchstart'];
      events.forEach(evt => document.addEventListener(evt, startTimer));

      return () => {
        clearTimeout(timerId.current);
        events.forEach(evt => document.removeEventListener(evt, startTimer));
      };
    }

    // Cleanup on homepage unmount
    return () => clearTimeout(timerId.current);
  }, [pathname, isHomePage]);

  if (!showPopover) return null;

  return (
    <div className="chatbot-popover">
      <img
        src={chatbotAvatar}
        alt="Tomas avatar"
        className="chatbot-avatar-popover"
      />
      <div className="chatbot-message">
        <p>
          <strong>Hello, I'm Tomas!</strong><br />
          I can help with taxes, health, residency, and work in Lithuania.
          Just ask me anything!
        </p>
      </div>
      <button className="popover-close" onClick={() => setShowPopover(false)}>
        ✕
      </button>
    </div>
  );
};

export default ChatbotPopover;