import React from 'react';
import '../../css/appointment/appointmentsPage.css';

const AlertModal = ({ isOpen, message, onClose, type = 'info' }) => {
  if (!isOpen) return null;

  const colors = {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          borderLeft: `6px solid ${colors[type]}`,
        }}
      >
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: colors[type] }}>
            {type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : type === 'warning' ? 'Advertencia' : 'Información'}
          </h4>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className="modal-action-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
