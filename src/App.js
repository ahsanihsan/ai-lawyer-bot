import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Threads from "./pages/Threads";
import Home from "./pages/Home";
import Sidebar from "./component/sidebar/Sidebar";
import { URL_API } from "./url";
import Modal from "./component/Modal";
import "./App.css";

const App = () => {
  const navigate = useNavigate();

  const [threadList, setThreadList] = useState([]);
  const [username, setUsername] = useState("");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchThreads = useCallback(async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`${URL_API}GetThreadList?user_name=${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setThreadList(data?.reverse());
      } else {
        alert("An error occurred while fetching the threads.");
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
    finally {
      setLoading(false);
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
    setLoading(true);
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
        navigate(`/${data}`);
      } else {
        alert("An error occurred while creating the thread.");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
    }
    finally {
      setLoading(false);
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
        <Sidebar addNewThread={addNewThread} threadList={threadList} loading={loading} />
        <Routes>
          <Route path="/" element={<Home addNewThread={addNewThread} />} />
          <Route
            path="/:id"
            element={<Threads setIsUsernameModalOpen={setIsUsernameModalOpen} loading={loading} />}
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
          <h2>Enter Username To Login</h2>
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
