import React, { useState } from "react";
import "./sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ addNewThread, threadList, loading }) => {
  const [navLoading, setNavLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (thread) => {
    setNavLoading(true);
    setTimeout(() => {
      navigate(`/${thread}`);
      setNavLoading(false);
    }, 500); 
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-wrapper">
        <div className="sidebar-top">
          <div className="new-thread" onClick={addNewThread}>
            <span>🤖</span>
            Add New Thread
            <span>+</span>
          </div>
        </div>
        <div className="thread-list-wrapper">
          {loading || navLoading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            threadList.map((thread, index) => (
              <NavLink
                to={`/${thread}`}
                key={index}
                className={({ isActive }) => `thread-list ${isActive ? "active" : ""}`}
                onClick={() => handleNavigation(thread)}>
                <div>Chat {thread}</div>
              </NavLink>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
