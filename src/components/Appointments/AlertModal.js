import React from 'react';
import '../../css/appointment/appointmentsPage.css'; // Estilos compartidos para citas y modales

// Componente de modal de alerta
const AlertModal = ({ isOpen, message, onClose, type = 'info' }) => {
  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  // Colores según tipo de mensaje
  const colors = {
    success: '#4CAF50', // verde para éxito
    error: '#F44336',   // rojo para error
    warning: '#FFC107', // amarillo para advertencia
    info: '#2196F3',    // azul para información
  };

  return (
    // Fondo semi-transparente que cubre toda la pantalla
    <div className="modal-overlay">
      {/* Contenedor del modal */}
      <div className="modal-content" style={{ borderLeft: `8px solid ${colors[type]}` }}>
        {/* Mensaje de alerta */}
        <p>{message}</p>
        {/* Botón para cerrar el modal */}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default AlertModal;
