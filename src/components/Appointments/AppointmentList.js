import React from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormSelect, CAvatar } from '@coreui/react';
import { cilTrash, cilPencil, cilCalendarCheck } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const AppointmentList = ({ appointments, onEdit, onDelete, onUpdateStatus }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { text: 'PENDIENTE', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.4)' };
      case 'Scheduled': return { text: 'PROGRAMADA', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.4)' };
      case 'Completed': return { text: 'COMPLETADA', color: '#10b981', border: 'rgba(16, 185, 129, 0.4)' };
      case 'Cancelled': return { text: 'CANCELADA', color: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' };
      default: return { text: status.toUpperCase(), color: '#9ca3af', border: 'rgba(156, 163, 175, 0.4)' };
    }
  };

  const getServiceStyle = (service) => {
    switch (service) {
      case 'Cirugía': return { bg: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', icon: '✂️' };
      case 'Vacunación': return { bg: 'rgba(52, 211, 153, 0.2)', color: '#34d399', icon: '💉' };
      case 'Peluquería': return { bg: 'rgba(251, 146, 60, 0.2)', color: '#fb923c', icon: '🚿' };
      default: return { bg: 'rgba(255, 255, 255, 0.05)', color: '#d1d5db', icon: '🩺' };
    }
  };

  return (
    <div className="p-4 shadow-lg" style={{ backgroundColor: '#1c222d', borderRadius: '24px' }}>
      <CTable align="middle" responsive className="border-0 m-0 text-white">
        <CTableHead>
          <CTableRow style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
            <CTableHeaderCell className="py-3 border-0 text-uppercase small" style={{ color: '#9ca3af' }}>Paciente / Dueño</CTableHeaderCell>
            <CTableHeaderCell className="py-3 border-0 text-uppercase small" style={{ color: '#9ca3af' }}>Servicio</CTableHeaderCell>
            <CTableHeaderCell className="py-3 border-0 text-uppercase small" style={{ color: '#9ca3af' }}>Fecha y Hora</CTableHeaderCell>
            <CTableHeaderCell className="py-3 border-0 text-uppercase small text-center" style={{ color: '#9ca3af' }}>Estado</CTableHeaderCell>
            <CTableHeaderCell className="py-3 border-0 text-uppercase small text-center" style={{ color: '#9ca3af' }}>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {appointments.map((appt) => {
            const statusInfo = getStatusStyle(appt.status);
            const serviceInfo = getServiceStyle(appt.service_type);
            
            // Formateo seguro de fecha: YYYY-MM-DD -> DD/MM/YYYY
            const formattedDate = appt.appointment_date 
              ? new Date(appt.appointment_date).toISOString().split('T')[0].split('-').reverse().join('/')
              : 'N/A';

            return (
              <CTableRow key={appt.id} className="border-0">
                <CTableDataCell className="py-4 border-0">
                  <div className="d-flex align-items-center">
                    <CAvatar size="md" src={appt.pet_image || 'https://via.placeholder.com/100?text=🐾'} className="border border-secondary" />
                    <div className="ms-3">
                      <div className="fw-bold fs-6">{appt.pet_name}</div>
                      <div style={{ color: '#ffb347', fontSize: '0.8rem' }}>Prop: {appt.owner_name}</div>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell className="border-0">
                  <span className="px-3 py-1 rounded fw-semibold small" style={{ backgroundColor: serviceInfo.bg, color: serviceInfo.color }}>
                    {serviceInfo.icon} {appt.service_type || 'Consulta'}
                  </span>
                </CTableDataCell>
                <CTableDataCell className="border-0">
                  <div className="fw-bold">{formattedDate}</div>
                  <div className="small text-info"><CIcon icon={cilCalendarCheck} size="sm" /> {appt.appointment_time?.slice(0, 5)}</div>
                </CTableDataCell>
                <CTableDataCell className="text-center border-0">
                  <CFormSelect size="sm" value={appt.status} onChange={(e) => onUpdateStatus(appt.id, e.target.value)} className="bg-dark border-secondary text-white text-center" style={{ fontSize: '0.8rem', width: '125px' }}>
                    <option value="Pending">Pendiente</option>
                    <option value="Scheduled">Programada</option>
                    <option value="Completed">Completada</option>
                    <option value="Cancelled">Cancelada</option>
                  </CFormSelect>
                </CTableDataCell>
                <CTableDataCell className="text-center border-0">
                  <div className="d-flex gap-2 justify-content-center">
                    <CButton className="rounded-circle p-0" style={{ width: '35px', height: '35px', backgroundColor: '#4f46e5', border: 'none' }} onClick={() => onEdit(appt)}>
                      <CIcon icon={cilPencil} size="sm" className="text-white" />
                    </CButton>
                    <CButton className="rounded-circle p-0" style={{ width: '35px', height: '35px', backgroundColor: '#dc2626', border: 'none' }} onClick={() => onDelete(appt.id)}>
                      <CIcon icon={cilTrash} size="sm" className="text-white" />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            );
          })}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default AppointmentList;