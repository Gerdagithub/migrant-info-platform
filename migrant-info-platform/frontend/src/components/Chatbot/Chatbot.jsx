import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Chatbot.css";
import chatbotLogo from "../../assets/images/chatbot-logo.png";
import ChatbotPopover from './ChatbotPopover';
import { marked } from "marked";
import DOMPurify from "dompurify";
import sendButton from "../../assets/images/send-button.png";
import { postWithRetry } from "../utils/retryAxios";


DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});


const Chatbot = () => {
  // Toggle chat window
  const [isOpen, setIsOpen] = useState(false);
  // Current user input
  const [question, setQuestion] = useState("");
  // Are we waiting on the bot’s answer?
  const [isLoading, setIsLoading] = useState(false);

  // Initial chatbot introduction message
  const initialIntro = { 
    type: "chatbot", 
    text: "**Hello, I’m Tomas**\nHelping with taxes, health, residency, and work in Lithuania. I’m here to answer any questions that don’t require personal data. Just ask me anything!" 
  };

  // Chat history, persisted in sessionStorage; default to intro message
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [initialIntro];
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
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);
  
  // Handle form submission (send question)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const trimmed = question.trim();
  //   if (!trimmed) return;

  //   // Add user message
  //   const newMessages = [...messages, { type: "user", text: trimmed }];
  //   setMessages(newMessages);
  //   setQuestion("");
  //   setIsLoading(true);

  //   try {
  //     const res = await axios.post(
  //       "/chatbot/chatbot_response/", 
  //       { question: trimmed },
  //       { timeout: 60000 }
  //     );
  //     const cleanAnswer = res.data.answer.trim();
  //     setMessages(prev => [...newMessages, { type: "chatbot", text: cleanAnswer }]);
  //   } catch (error) {
  //     setMessages(prev => [...newMessages, { type: "chatbot", text: "Error communicating with the server." }]);
  //   } finally {
  //     setIsLoading(false);
  //   }

  //   // Reset textarea height
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = "40px";
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  const trimmed = question.trim();
  if (!trimmed) return;

  const newMessages = [...messages, { type: "user", text: trimmed }];
  setMessages(newMessages);
  setQuestion("");
  setIsLoading(true);

//   try {
//     const res = await axios.post(
//       "/chatbot/chatbot_response/",
//       { question: trimmed },
//       { timeout: 60000 }    // ← wait up to 60 s
//     );
//     const cleanAnswer = res.data.answer.trim();
//     setMessages(prev => [...newMessages, { type: "chatbot", text: cleanAnswer }]);
//   } catch (error) {
//     console.error("Chatbot request failed:", error);
//     const msg = error.response
//       ? `Server error: ${error.response.status}`
//       : error.message;
//     setMessages(prev => [...newMessages, { type: "chatbot", text: msg }]);
//   } finally {
//     setIsLoading(false);
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "40px";
//     }
//   }
// };
try {
  const res = await postWithRetry(
    "/chatbot/chatbot_response/",
    { question: trimmed },
    { timeout: 60000 },
    3,      // 3 attempts
    1000    // start with 1s backoff
  );
  const cleanAnswer = res.data.answer.trim();
  setMessages(prev => [...newMessages, { type: "chatbot", text: cleanAnswer }]);
} catch (error) {
  console.error("All retries failed:", error);
  setMessages(prev => [
    ...newMessages,
    { type: "chatbot", text: "Network error—please try again in a moment." }
  ]);
}finally {
    setIsLoading(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
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
      <div className="chat-bubble-icon" onClick={() => setIsOpen(true)}>
        <img src={chatbotLogo} alt="Chat" className="chatbot-bubble" />
      </div>

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

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}/>
              </div>
            ))}

          {isLoading && (
            <div className="message chatbot loading">
              <div className="spinner-border custom-spinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="loading-text">Please wait, I’m working on an answer…</span>
            </div>
          )}

            <div ref={messagesEndRef} />
          </div>

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
              <button 
                type="submit" 
                className="send-button"
                disabled={!question.trim()}
              >
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




// import React, { useState, useRef, useEffect } from 'react';
// import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "./Chatbot.css";
// import chatbotLogo from "../../assets/images/chatbot-logo.png";
// import ChatbotPopover from './ChatbotPopover';

// import { marked } from "marked";
// import DOMPurify from "dompurify";

// import sendButton from "../../assets/images/send-button.png";

// const Chatbot = () => {
//   // Toggle chat window
//   const [isOpen, setIsOpen] = useState(false);
//   // Current user input
//   const [question, setQuestion] = useState("");

//   // Initial chatbot introduction message
// 	const initialIntro = { 
// 		type: "chatbot", 
// 		text: "**Hello, I’m Tomas**\nHelping with taxes, health, residency, and work in Lithuania. I’m here to answer any questions that don’t require personal data. Just ask me anything!" 
// 	};

//   // Chat history, persisted in sessionStorage; default to intro message
//   const [messages, setMessages] = useState(() => {
//     const saved = sessionStorage.getItem('chat_messages');
//     return saved ? JSON.parse(saved) : [initialIntro];
//   });

//   const textareaRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Persist messages to sessionStorage on change
//   useEffect(() => {
//     sessionStorage.setItem('chat_messages', JSON.stringify(messages));
//   }, [messages]);

//   // Scroll to bottom when chat opens or messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [isOpen, messages]);

//   useEffect(() => {
// 	if (isOpen) {
// 	  document.body.classList.add('no-scroll');
// 	} else {
// 	  document.body.classList.remove('no-scroll');
// 	}
// 	return () => {
// 	  document.body.classList.remove('no-scroll');
// 	};
//   }, [isOpen]);
  

//   // Handle form submission (send question)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const trimmed = question.trim();
//     if (!trimmed) return;

//     // Add user message
//     const newMessages = [...messages, { type: "user", text: trimmed }];
//     setMessages(newMessages);
//     setQuestion("");

//     try {
//       const res = await axios.post("/chatbot/chatbot_response/", { question: trimmed });
//       const cleanAnswer = res.data.answer.trim();
//       setMessages([...newMessages, { type: "chatbot", text: cleanAnswer }]);
//     } catch (error) {
//       setMessages([...newMessages, { type: "chatbot", text: "Error communicating with the server." }]);
//     }

//     // Reset textarea height
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "40px";
//     }
//   };

//   // Auto-resize textarea on input
//   const handleInputChange = (e) => {
//     setQuestion(e.target.value);
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   };

//   // Send on Enter, newline on Shift+Enter
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   // Format and sanitize Markdown
//   const formatMarkdown = (text) => {
//     const cleaned = text.trim().replace(/\n{3,}/g, "\n\n");
//     const rawHtml = marked.parse(cleaned);
//     return DOMPurify.sanitize(rawHtml);
//   };

//   return (
//     <>
//       {/* Chat bubble icon to open chat */}
//       <div className="chat-bubble-icon" onClick={() => setIsOpen(true)}>
//         <img src={chatbotLogo} alt="Chat" className="chatbot-bubble" />
//       </div>

//       {/* Chat window overlay */}
//       {isOpen && (
//         <div className="chat-window-overlay">
//           <div className="chat-header">
//             <div className="chatbot-info">
//               <img src={chatbotLogo} alt="Tomas" className="chatbot-avatar" />
//               <div className="chatbot-meta">
//                 <div className="chatbot-name">Tomas</div>
//                 <div className="chatbot-role">Migration Assistant</div>
//               </div>
//             </div>
//             <button className="collapse-chat-button" onClick={() => setIsOpen(false)}>✖</button>
//           </div>

//           {/* Messages container */}
//           <div className="messages-container">
//             {messages.map((msg, index) => (
//               <div key={index} className={`message ${msg.type}`}> 
//               {/* new */}
//               <div className="message-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}/>

//                 {/* <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} /> */}
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input form */}
//           <form onSubmit={handleSubmit} className="chatbot-input-form">
//             <div className="chatbot-input-container">
//               <textarea
//                 ref={textareaRef}
//                 value={question}
//                 onChange={handleInputChange}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Enter your question"
//                 className="chatbot-input"
//                 rows="1"
//               />
//               <button type="submit" className="send-button">
//                 <img src={sendButton} alt="Send" />
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//       <ChatbotPopover />
//     </>
//   );
// };

// export default Chatbot;