import React, { useCallback, useEffect, useState } from "react";
import "./chatbox.css";
import { URL_API } from "../../url";
import { useNavigate } from "react-router-dom";

const Chatbox = ({
  setIsUsernameModalOpen,
  messages,
  setIsModalOpen,
  setActiveSource,
  setMessages,
  threadId,
}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const fetchThreads = async () => {
    try {
      setMessages([]);
      const response = await fetch(
        `${URL_API}GetThreadHistory?user_name=${username}&thread_index=${threadId}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const messagesNow = parseMessages(data);
        setMessages(messagesNow);
      } else {
        alert("An error occurred while fetching the threads.");
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [threadId]);

  const parseMessages = (messages) => {
    let finalMessages = [];
    messages.forEach((item) => {
      const userMessage = { id: Date.now(), text: item.question, sender: "user" };
      const responseMessage = {
        id: Date.now() + 1,
        text: item.answer,
        source: item.source_list,
        sender: "bot",
      };
      finalMessages.push(userMessage);
      finalMessages.push(responseMessage);
    });
    return finalMessages;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${URL_API}AskQuestion?user_name=${username}&user_querry=${input}&thread_index=${threadId}`
      );
      console.log({ response });
      const data = await response.json();
      console.log({ data });
      if (response.status === 200) {
        const responseMessage = {
          id: Date.now() + 1,
          text: data.response,
          source: data.source_content,
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

  const removeUser = async () => {
    try {
      // const response = await fetch(`${URL_API}RemoveUser?user_name=${username}`, {
      //   method: "DELETE",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // const data = await response.json();
      // if (response.status === 200) {
      localStorage.removeItem("username");
      setIsUsernameModalOpen(true);
      navigate("/");
      // } else {
      //   localStorage.removeItem("username");
      //   setIsUsernameModalOpen(true);
      // }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="App-header">
      <div>
        <h1>Lawyer AI Bot</h1>
        {/* <button onClick={() => [localStorage.setItem("username", "")]}>Remove User</button> */}
        <button onClick={removeUser}>Remove User</button>
      </div>

      {/* //- Display Uer Chat Component */}
      <div className="chat-wrapper">
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
                  }}>
                  Source
                </p>
              ) : undefined}
            </div>
          ))}
          {isLoading && <div className="message bot">Loading...</div>}
        </div>

        {/* //- Uer Quotes Input Component */}
        <form onSubmit={handleSendMessage} className="text-field-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
