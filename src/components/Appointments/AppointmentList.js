import React from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormSelect } from '@coreui/react';

const AppointmentList = ({ appointments, onEdit, onDelete, onUpdateStatus }) => {
  return (
    <CTable align="middle" bordered hover responsive>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell>Fecha Creada</CTableHeaderCell>
          <CTableHeaderCell>Cliente</CTableHeaderCell>
          <CTableHeaderCell>Mascota</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Notas</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {appointments.map((appt) => (
          <CTableRow key={appt.id}>
            <CTableDataCell>{new Date(appt.fecha_creacion).toLocaleDateString()}</CTableDataCell>
            <CTableDataCell><strong>{appt.nombre_cliente}</strong></CTableDataCell>
            <CTableDataCell>{appt.nombre_mascota}</CTableDataCell>
            <CTableDataCell>
              <CFormSelect 
                size="sm" 
                value={appt.estado} 
                onChange={(e) => onUpdateStatus(appt.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </CFormSelect>
            </CTableDataCell>
            <CTableDataCell>{appt.notas || '-'}</CTableDataCell>
            <CTableDataCell>
              <div className="d-flex gap-2">
                <CButton color="info" variant="outline" size="sm" onClick={() => onEdit(appt)}>
                  Editar
                </CButton>
                <CButton color="danger" variant="outline" size="sm" onClick={() => onDelete(appt.id)}>
                  Eliminar
                </CButton>
              </div>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default AppointmentList;