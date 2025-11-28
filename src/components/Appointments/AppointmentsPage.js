// AppointmentPage.jsx
import React, { useState, useMemo } from 'react';
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import '../../css/Inventory/inventory.css';
import AlertModal from './AlertModal';

// MOCK datos (clientes, mascotas, veterinarios, citas) — reemplaza por llamadas a tu API/json-server luego
const MOCK_CLIENTES = [
  { id: 1, nombre: 'Carlos Peña' },
  { id: 2, nombre: 'Marta Ruiz' },
  { id: 3, nombre: 'Ricardo Torres' },
];

const MOCK_MASCOTAS = [
  { id: 1, cliente_id: 1, nombre: 'Firulais', foto: '' },
  { id: 2, cliente_id: 1, nombre: 'Luna', foto: '' },
  { id: 3, cliente_id: 2, nombre: 'Tommy', foto: '' },
];

const MOCK_VETS = [
  { id: 101, nombre: 'Dr. Gómez', especialidad: 'General' },
  { id: 102, nombre: 'Dra. Pérez', especialidad: 'Dermatología' },
];

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    mascota_id: 1,
    veterinario_id: 101,
    fecha_cita: '2025-02-01T10:00:00.000Z',
    estado: 'Pendiente',
    notas: 'Revisión general',
  },
  {
    id: 2,
    mascota_id: 2,
    veterinario_id: 102,
    fecha_cita: '2025-02-01T11:00:00.000Z',
    estado: 'Confirmada',
    notas: '',
  },
  {
    id: 3,
    mascota_id: 3,
    veterinario_id: 101,
    fecha_cita: '2025-02-02T09:30:00.000Z',
    estado: 'Completada',
    notas: 'Consulta dermatológica',
  },
];

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [showModal, setShowModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);

  // Alert modal (global)
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Índices rápidos para mostrar cliente/vet cuando sea necesario
  const indexMascotas = useMemo(() => Object.fromEntries(MOCK_MASCOTAS.map(m => [m.id, m])), []);
  const indexVets = useMemo(() => Object.fromEntries(MOCK_VETS.map(v => [v.id, v])), []);
  const indexClientes = useMemo(() => Object.fromEntries(MOCK_CLIENTES.map(c => [c.id, c])), []);

  // Normalizar citas para la lista (añadir cliente/mascota/vet)
  const appointmentsWithRelations = useMemo(() =>
    appointments.map(a => ({
      ...a,
      mascota: indexMascotas[a.mascota_id],
      vet: indexVets[a.veterinario_id],
      cliente: indexClientes[indexMascotas[a.mascota_id]?.cliente_id],
    }))
  , [appointments, indexMascotas, indexVets, indexClientes]);

  const handleSave = (payload) => {
    // Si tiene id igualamos la edición; si no, crear
    if (editAppointment) {
      setAppointments(prev =>
        prev.map(item => (item.id === editAppointment.id ? { ...payload, id: editAppointment.id } : item))
      );
      setAlertMsg('Cita actualizada correctamente.');
      setAlertType('success');
    } else {
      setAppointments(prev => [...prev, { ...payload, id: Date.now() }]);
      setAlertMsg('Cita registrada correctamente.');
      setAlertType('success');
    }

    setAlertOpen(true);
    setShowModal(false);
    setEditAppointment(null);
  };

  const handleEdit = (appt) => {
    // Preparamos initialValues adecuados para AppointmentForm (fecha en formato datetime-local)
    const init = {
      mascota_id: appt.mascota_id,
      veterinario_id: appt.veterinario_id,
      fecha_cita: new Date(appt.fecha_cita).toISOString().slice(0,16), // datetime-local expects yyyy-mm-ddThh:mm
      estado: appt.estado,
      notas: appt.notas || '',
      evidencia_url: appt.evidencia_url || '',
    };
    setEditAppointment({ ...appt, initialValues: init });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Desea eliminar esta cita?')) return;
    setAppointments(prev => prev.filter(a => a.id !== id));
    setAlertMsg('Cita eliminada');
    setAlertType('success');
    setAlertOpen(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, estado: newStatus } : a)));
  };

  return (
    <div className="container">
      <CButton color="primary" className="add-product-btn" onClick={() => { setEditAppointment(null); setShowModal(true); }}>
        Agregar Cita
      </CButton>

      <AppointmentList
        appointments={appointmentsWithRelations}
        onEdit={(a) => handleEdit(a)}
        onDelete={(id) => handleDelete(id)}
        onUpdateStatus={(id, st) => handleUpdateStatus(id, st)}
      />

      {/* Modal del formulario */}
      <CModal visible={showModal} onClose={() => { setShowModal(false); setEditAppointment(null); }}>
        <CModalHeader>
          <CModalTitle>{editAppointment ? 'Editar Cita' : 'Agregar Cita'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <AppointmentForm
            onSubmit={handleSave}
            mascotas={MOCK_MASCOTAS}
            veterinarios={MOCK_VETS}
            appointments={appointments} // para validación de doble booking
            initialValues={editAppointment?.initialValues || undefined}
            onClose={() => { setShowModal(false); setEditAppointment(null); }}
          />
        </CModalBody>
      </CModal>

      {/* Alert global */}
      <AlertModal
        isOpen={alertOpen}
        message={alertMsg}
        type={alertType}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default AppointmentPage;
