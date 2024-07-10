import React, { useState } from "react";
import "./threads.css";
import { useParams } from "react-router-dom";
import Chatbox from "../component/chatbox/Chatbox";
import Modal from "../component/Modal";

const Threads = ({ setIsUsernameModalOpen, loading }) => {
  const { id } = useParams();

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
      <section className="chat-container">
        <Chatbox
          setIsUsernameModalOpen={setIsUsernameModalOpen}
          messages={messages}
          setMessages={setMessages}
          setIsModalOpen={setIsModalOpen}
          setActiveSource={setActiveSource}
          loading={loading}
          threadId={id}
        />
      </section>

      {activeSource && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} showClose={true}>
          <h1>Sources</h1>
          <p>{showSourceContent()}</p>
        </Modal>
      )}
    </>
  );
};

export default Threads;
