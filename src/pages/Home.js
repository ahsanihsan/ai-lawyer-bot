import React, { useState } from "react";
import "./home.css";
import Modal from "../component/Modal";
import Chatbox from "../component/chatbox/Chatbox";

function Home({ username, setIsUsernameModalOpen }) {
  const [messages, setMessages] = useState([]);
  const [activeSource, setActiveSource] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      {/* <section className="chat-container">
        <Chatbox
          username={username}
          setIsUsernameModalOpen={setIsUsernameModalOpen}
          messages={messages}
          setIsModalOpen={setIsModalOpen}
          setActiveSource={setActiveSource}
          setMessages={setMessages}
        />
      </section>

      {activeSource ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} showClose={true}>
          <h1>Sources</h1>
          <p>{showSourceContent()}</p>
        </Modal>
      ) : undefined} */}
    </>
  );
}

export default Home;
