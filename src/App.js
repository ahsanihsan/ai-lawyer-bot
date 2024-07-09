import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Threads from "./pages/Threads";
import Home from "./pages/Home";
import Sidebar from "./component/sidebar/Sidebar";
import { URL_API } from "./url";
import Modal from "./component/Modal";

const App = () => {
  const [threadList, setThreadList] = useState([]);
  const [username, setUsername] = useState("");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

  const fetchThreads = useCallback(async (username) => {
    try {
      const response = await fetch(`${URL_API}GetThreadList?user_name=${username}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log({ response });

      if (response.ok) {
        const data = await response.json();

        setThreadList(data?.reverse());
      } else {
        alert("An error occurred while fetching the threads.");
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  }, []);

  const storedUsername = localStorage.getItem("username");
  useEffect(() => {
    if (!storedUsername) {
      setIsUsernameModalOpen(true);
    } else {
      setUsername(storedUsername);
      fetchThreads(storedUsername);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsernameModalOpen, storedUsername]);

  const addNewThread = async () => {
    try {
      const response = await fetch(`${URL_API}CreateThread?user_name=${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        fetchThreads(username);
      } else {
        alert("An error occurred while creating the thread.");
      }
      console.log(data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${URL_API}CreateUser?user_name=${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("username", username);
        setIsUsernameModalOpen(false);
        setUsername("");
      } else if (response.status === 404) {
        localStorage.setItem("username", username);
        setIsUsernameModalOpen(false);
        setUsername("");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred while creating the user.");
    }
  };
  return (
    <div className="App">
      <div className="root-container">
        <Sidebar addNewThread={addNewThread} threadList={threadList} />
        <Routes>
          <Route path="/" element={<Home setIsUsernameModalOpen={setIsUsernameModalOpen} />} />
          <Route
            path="/:id"
            element={<Threads setIsUsernameModalOpen={setIsUsernameModalOpen} />}
          />
        </Routes>
      </div>

      {/* //- User Login - Entery Model - Dialog */}
      <Modal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        showClose={false}
        disableOverlayClose={true}>
        <div className="">
          <h2>Enter Username</h2>
          <form onSubmit={handleUsernameSubmit} className="modal-form-wrapper">
            <input
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default App;
