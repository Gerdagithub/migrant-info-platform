import React, { useState, useRef } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Chatbot.css";
import chatbotLogo from "../../assets/images/chatbotLogo.png";

const Chatbot = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [question, setQuestion] = useState("");
	const [messages, setMessages] = useState([]); 
	const textareaRef = useRef(null); 
  
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!question.trim()) return; 
	
		const newMessages = [...messages, { type: "user", text: question }];
		setMessages(newMessages);
		setQuestion("");
	
		try {
		  const res = await axios.post("/chatbot/chatbot_response/", { question });
			// const res = await axios.post("http://127.0.0.1:8000/chatbot/chatbot_response/", { question });
		  setMessages([...newMessages, { type: "chatbot", text: res.data.answer }]);
		} catch (error) {
		  setMessages([...newMessages, { type: "chatbot", text: "Error communicating with the server." }]);
		}
	
		// Reset textarea height after sending message
		if (textareaRef.current) {
		  textareaRef.current.style.height = "40px";
		}
	};

	const handleInputChange = (e) => {
		setQuestion(e.target.value);
	
		if (textareaRef.current) {
		  textareaRef.current.style.height = "auto"; 
		  textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	// This handler checks for Enter and Shift+Enter
	const handleKeyDown = (e) => {
		// If Enter is pressed without Shift, send the message
		if (e.key === 'Enter' && !e.shiftKey) {
		  e.preventDefault(); // Prevent default newline insertion
		  handleSubmit(e);
		}
		// If Shift+Enter is pressed, let the default behavior insert a newline
	};

	return (
	  <>
		{/* Chat Bubble */}
		<div className="chat-bubble-icon" onClick={() => setIsOpen(true)}>
		  <img 
		  	src={chatbotLogo} 
			alt="Chat"
			className="chatbot-bubble"/>
		</div>
		
		{/* Fullscreen Chat Overlay */}
		{isOpen && (
		  <div className="chat-window-overlay">
			<div className="chat-header">
			  <h2>Chatbot</h2>
			  <button onClick={() => setIsOpen(false)}>Close</button>
			</div>
			
			{messages.length === 0 && (
				<div className="assistant-placeholder main-title">Ask a question</div>
			)}
			<div className="messages-container">
				{messages.map((msg, index) => (
					<div key={index} className={`message ${msg.type}`}>
					{msg.text}
					</div>
				))}
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
				<button type="submit" className="send-button">↑</button>
				</div>
			</form>
		  </div>
		)}
	  </>
	);
  }
  

export default Chatbot;
