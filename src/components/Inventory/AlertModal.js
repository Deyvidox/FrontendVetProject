import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CButton } from '@coreui/react';

const AlertModal = ({ isOpen, message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-success text-white' : 'bg-danger text-white';

  return (
    <CModal visible={isOpen} onClose={onClose} alignment="center">
      <CModalHeader className={bgColor}>
        <CModalTitle>{type === 'success' ? 'Éxito' : 'Error'}</CModalTitle>
        {/* Botón de cerrar visible */}
        <CButton
          color="light"
          className="btn-close"
          onClick={onClose}
          style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: '1', borderRadius: '50%', padding: '0.25rem 0.5rem' }}
        >
          &times;
        </CButton>
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
