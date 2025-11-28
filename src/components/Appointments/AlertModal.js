// AlertModal.jsx
import React from 'react';
import '../../css/appointment/appointmentsPage.css'; // CSS global para modales

const AlertModal = ({ isOpen, message, onClose, type = 'info' }) => {
  if (!isOpen) return null;

  const colors = {
    success: '#4CAF50', // verde
    error: '#F44336',   // rojo
    warning: '#FFC107', // amarillo
    info: '#2196F3',    // azul
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          borderLeft: `6px solid ${colors[type]}`,
        }}
      >
        {/* Header con título y botón X */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: colors[type] }}>
            {type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : type === 'warning' ? 'Advertencia' : 'Información'}
          </h4>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Contenido */}
        <div className="modal-body">
          <p>{message}</p>
        </div>

        {/* Botón de acción */}
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
