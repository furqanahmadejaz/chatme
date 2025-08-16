

import { io } from "socket.io-client"
import { useRef, useEffect, useState } from "react"

const Home = () => {
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState("")
  const [tempUsername, setTempUsername] = useState("")

  const socketRef = useRef(null)
  useEffect(() => {
    socketRef.current = io("http://localhost:4000")

    socketRef.current.on("connect", () => {
      console.log("Connected to the server")
    })

    socketRef.current.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg])
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  const handleClick = () => {
    if (messageText.trim() !== "") {
      socketRef.current.emit("message", { messageText, username })
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

      {!username && (
        <div className="username-setup">
          <div className="welcome-card">
            <h2 className="welcome-title">Welcome to ChatMe</h2>
            <p className="welcome-subtitle">Enter your username to start chatting</p>
            <div className="username-form">
              <input
                type="text"
                className="username-input"
                placeholder="Enter your username"
                onChange={(e) => setTempUsername(e.target.value)}
                value={tempUsername}
                onKeyPress={(e) => e.key === "Enter" && setUsername(tempUsername)}
              />
              <button
                className="username-btn"
                onClick={() => setUsername(tempUsername)}
                disabled={!tempUsername.trim()}
              >
                Join Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {username && (
        <div className="chat-interface">
          <div className="chat-header-user">
            <div className="user-info">
              <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
              <span className="username-display">Welcome, {username}!</span>
            </div>
          </div>

          <div className="messages-container" id="messagesContainer">
            <ul className="messages-list" id="messagesList">
              {messages &&
                messages.map((msg, idx) =>
                  msg.username === username ? (
                    <li key={idx} className="message-item my-message">
                      <div className="message-bubble">
                        <div className="message-content">{msg.messageText}</div>
                        <div className="message-time">You</div>
                      </div>
                    </li>
                  ) : (
                    <li key={idx} className="message-item other-message">
                      <div className="message-bubble">
                        <div className="message-sender">{msg.username}</div>
                        <div className="message-content">{msg.messageText}</div>
                      </div>
                    </li>
                  ),
                )}
            </ul>
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
      )}
    </div>
  )
}

export default Home
