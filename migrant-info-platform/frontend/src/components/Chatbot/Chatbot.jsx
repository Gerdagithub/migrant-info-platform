import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Chatbot.css";
import chatbotLogo from "../../assets/images/chatbot-logo.png";
import ChatbotPopover from './ChatbotPopover';

import { marked } from "marked";
import DOMPurify from "dompurify";

import sendButton from "../../assets/images/send-button.png";

const Chatbot = () => {
  // Toggle chat window
  const [isOpen, setIsOpen] = useState(false);
  // Current user input
  const [question, setQuestion] = useState("");
  // Chat history, persisted in sessionStorage
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Persist messages to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when chat opens or messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  // Handle form submission (send question)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    // Add user message
    const newMessages = [...messages, { type: "user", text: trimmed }];
    setMessages(newMessages);
    setQuestion("");

    try {
      const res = await axios.post("/chatbot/chatbot_response/", { question: trimmed });
      const cleanAnswer = res.data.answer.trim();
      setMessages([...newMessages, { type: "chatbot", text: cleanAnswer }]);
    } catch (error) {
      setMessages([...newMessages, { type: "chatbot", text: "Error communicating with the server." }]);
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  // Auto-resize textarea on input
  const handleInputChange = (e) => {
    setQuestion(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Send on Enter, newline on Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Format and sanitize Markdown
  const formatMarkdown = (text) => {
    const cleaned = text.trim().replace(/\n{3,}/g, "\n\n");
    const rawHtml = marked.parse(cleaned);
    return DOMPurify.sanitize(rawHtml);
  };

  return (
    <>
      {/* Chat bubble icon to open chat */}
      <div className="chat-bubble-icon" onClick={() => setIsOpen(true)}>
        <img src={chatbotLogo} alt="Chat" className="chatbot-bubble" />
      </div>

      {/* Chat window overlay */}
      {isOpen && (
        <div className="chat-window-overlay">
          <div className="chat-header">
            <div className="chatbot-info">
              <img src={chatbotLogo} alt="Tomas" className="chatbot-avatar" />
              <div className="chatbot-meta">
                <div className="chatbot-name">Tomas</div>
                <div className="chatbot-role">Migration Assistant</div>
              </div>
            </div>
            <button className="collapse-chat-button" onClick={() => setIsOpen(false)}>✖</button>
          </div>

          {/* Initial prompt when no messages */}
          {messages.length === 0 && (
            <>
              <div className="chatbot-initial-title">Ask me a question</div>
              <p id="chatbot-introduction">
                Hello! I help to answer questions that do not require personal data.
              </p>
            </>
          )}

          {/* Messages container */}
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}> 
                <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <div className="chatbot-input-container">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your question"
                className="chatbot-input"
                rows="1"
              />
              <button type="submit" className="send-button">
                <img src={sendButton} alt="Send" />
              </button>
            </div>
          </form>
        </div>
      )}
      <ChatbotPopover />
    </>
  );
};

export default Chatbot;