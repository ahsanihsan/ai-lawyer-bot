import React from "react";
import "./index.css";

const Modal = ({ isOpen, onClose, children, showClose, disableOverlayClose  }) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (!disableOverlayClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        {showClose && <button onClick={onClose}>Close</button>}
      </div>
    </div>
  );
};

export default Modal;
