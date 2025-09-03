

import { io } from "socket.io-client"
import { useRef, useEffect, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import {useLogout} from "../hooks/useLogout";
const Home = () => {
  // Scroll to bottom whenever messages change
  const messagesEndRef = useRef(null);
  const {logout} = useLogout();
  const handleLogout = () => {
    logout();
  }
  const { user } = useAuthContext();
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // fetch previous messages from the server
  const fetchMessages = async () => {
    try {
      const response = await fetch("https://chatme-1-jqgl.onrender.com/api/messages");
      const data = await response.json();

      setMessages(data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const socketRef = useRef(null)

  
  useEffect(() => {
    socketRef.current = io("https://chatme-1-jqgl.onrender.com");
    
    
    socketRef.current.on("connect", () => {
      console.log("Connected to the server")
    })
    fetchMessages();
    socketRef.current.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg])
    })
    

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  if (!user) {
    return null;             //return if not loggen in
  }

  const handleClick = () => {
    if (messageText.trim() !== "") {
      const message = {
        content: messageText,
        senderid: user.user._id,
        chatid: null
      }
      socketRef.current.emit("message", message)
      setMessageText("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="app-title">ChatMe</h1>
        
        <div className="status-indicator online"></div>
        
      </div>
        <div className="chat-interface">
          <div className="chat-header-user">
            <div className="user-info">
              <div className="user-avatar">{user.user.username.charAt(0).toUpperCase()}</div>
              <span className="username-display">Welcome, {user.user.username}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>

          <div className="messages-container" id="messagesContainer">
            <ul className="messages-list" id="messagesList">
              {messages &&
                messages.map((msg, idx) =>
                  msg.senderid.email === user.user.email ? (
                    <li key={idx} className="message-item my-message">
                      <div className="message-bubble">
                        <div className="message-content">{msg.content}</div>
                        <div className="message-time">You</div>
                      </div>
                    </li>
                  ) : (
                    <li key={idx} className="message-item other-message">
                      <div className="message-bubble">
                        <div className="message-sender">{msg.senderid.username}</div>
                        <div className="message-content">{msg.content}</div>
                      </div>
                    </li>
                  ),
                )}
            </ul>
            <div ref={messagesEndRef}/>
          </div>

          <div className="message-input-container">
            <div className="input-wrapper">
              <textarea
                className="message-input"
                placeholder="Type your message here..."
                onChange={(e) => setMessageText(e.target.value)}
                value={messageText}
                onKeyPress={handleKeyPress}
                rows="1"
              />
              <button className="send-btn" onClick={handleClick} disabled={!messageText.trim()}>
                <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="m22 2-7 20-4-9-9-4z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Home
