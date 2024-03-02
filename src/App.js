import React, { useState } from "react";
import "./App.css";
import { URL_API } from "./url";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lawyer AI Bot</h1>
        <div className="chat-window">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {isLoading && <div className="message bot">Loading...</div>}{" "}
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
    </div>
  );
}

export default App;
