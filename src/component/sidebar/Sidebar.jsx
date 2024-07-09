import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = ({ addNewThread, threadList }) => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-wrapper">
        {/* Add New Thread Button */}
        <div className="sidebar-top">
          <div className="new-thread" onClick={addNewThread}>
            <span>🤖</span>
            Add New Thread
            <span>+</span>
          </div>
        </div>
        <div className="thread-list-wrapper">
          {threadList.map((thread, index) => (
            <Link to={`/${thread}`} key={index} className="thread-list">
              <div>Chat {thread}</div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
