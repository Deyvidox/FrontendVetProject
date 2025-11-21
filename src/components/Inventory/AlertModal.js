// AlertModal.jsx
import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CButton } from '@coreui/react';

// Props:
// isOpen: boolean para mostrar/ocultar modal
// message: mensaje a mostrar
// type: 'success' | 'error'
// onClose: función para cerrar el modal
const AlertModal = ({ isOpen, message, type, onClose }) => {
  // Determinamos el color según tipo de alerta
  const bgColor = type === 'success' ? 'bg-success text-white' : 'bg-danger text-white';

  return (
    <CModal visible={isOpen} onClose={onClose} alignment="center">
      <CModalHeader className={bgColor}>
        <CModalTitle>{type === 'success' ? 'Éxito' : 'Error'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>{message}</p>
        <CButton color="primary" onClick={onClose}>
          Cerrar
        </CButton>
      </CModalBody>
    </CModal>
  );
};

export default AlertModal;
