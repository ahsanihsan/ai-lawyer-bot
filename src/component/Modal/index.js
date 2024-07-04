import React from "react";
import "./index.css";

const Modal = ({ isOpen, onClose, children, showClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        {showClose && <button onClick={onClose}>Close</button>}
      </div>
    </div>
  );
};

export default Modal;
