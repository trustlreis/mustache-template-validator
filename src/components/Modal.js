import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, title, children, isValid }) => {
  if (!show) {
    return null; // Don't render the modal if show is false
  }

  return (
    <div className="modal-overlay">
      <div className={`modal ${isValid ? 'modal-success' : 'modal-error'}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-ok-button">OK</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
