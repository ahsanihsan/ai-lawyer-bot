import React, { useEffect, useState } from "react";
import "./App.css";
import Modal from "./component/Modal";
import { URL_API } from "./url";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeSource, setActiveSource] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      setIsUsernameModalOpen(true);
    } else {
      setUsername(storedUsername);
    }
  }, []);

  const handleUsernameSubmit = async () => {
    try {
      const response = await fetch(
        `${URL_API}CreateUser?user_name=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      localStorage.setItem("username", username);
      setIsUsernameModalOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred while creating the user.");
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${URL_API}AskQuestion?use_querry=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      if (data.status === "Pass") {
        const responseMessage = {
          id: Date.now() + 1,
          text: data.answer,
          source: data.source_documents,
          sender: "bot",
        };
        setMessages((messages) => [...messages, responseMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, I couldn't process your request.",
          sender: "bot",
        };
        setMessages((messages) => [...messages, errorMessage]);
      }
    } catch (error) {
      console.error("Fetching error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "An error occurred while processing your request.",
        sender: "bot",
      };
      setMessages((messages) => [...messages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const showSourceContent = () => {
    if (activeSource && activeSource.source)
      return Object.keys(activeSource.source).map((item) => {
        return (
          <div>
            <p>{activeSource.source[item]}</p>
            <br />
            <br />
          </div>
        );
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Lawyer AI Bot</h1>
          <button onClick={() => [localStorage.setItem("username", "")]}>
            Remove User
          </button>
        </div>
        <div className="chat-window">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              {message.text}
              {message.source ? (
                <p
                  className="source-btn"
                  onClick={() => {
                    setIsModalOpen(true);
                    setActiveSource(message);
                  }}
                >
                  Source
                </p>
              ) : undefined}
            </div>
          ))}
          {isLoading && <div className="message bot">Loading...</div>}
        </div>
        <div className="text-field-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </header>
      {activeSource ? (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          showClose={true}
        >
          <h1>Sources</h1>
          <p>{showSourceContent()}</p>
        </Modal>
      ) : undefined}
      <Modal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        showClose={false}
      >
        <div className="username-modal-content">
          <h2>Enter Username</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleUsernameSubmit}>Submit</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
