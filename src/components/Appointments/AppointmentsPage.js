import React, { useState } from 'react';
import AppointmentForm from './AppointmentForm';
import Calendar from 'react-calendar';
import '../../css/appointment/appointmentsPage.css';

// Datos simulados de mascotas
const MOCK_MASCOTAS = [
  { id: 1, nombre: 'Luna', foto: 'https://placekitten.com/120/120' },
  { id: 2, nombre: 'Max', foto: 'https://placekitten.com/121/121' },
  { id: 3, nombre: 'Kiara', foto: 'https://placekitten.com/122/122' },
];

// Datos simulados de veterinarios
const MOCK_VETERINARIOS = [
  { id: 101, nombre: 'Dra. Pérez', especialidad: 'Medicina general', foto: 'https://placekitten.com/123/123' },
  { id: 102, nombre: 'Dr. Gómez', especialidad: 'Cirugía', foto: 'https://placekitten.com/124/124' },
  { id: 103, nombre: 'Dra. Rojas', especialidad: 'Dermatología', foto: 'https://placekitten.com/125/125' },
];

const AppointmentsPage = ({ appointments, setAppointments }) => {
  const [editing, setEditing] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Guardar o editar cita
  const saveAppointment = (data) => {
    let updated;

    if (editing) {
      updated = appointments.map((a) =>
        a.id === editing.id ? { ...editing, ...data } : a
      );
    } else {
      updated = [...appointments, { ...data, id: Date.now() }];
    }

    setAppointments(updated); // Actualiza el estado del padre
    setEditing(null);
    setModalOpen(true); // Abrir modal de confirmación
  };

  // Fecha prellenada desde calendario
  const prefillFromCalendar = selectedDate
    ? new Date(selectedDate).toISOString().slice(0, 16)
    : '';

  return (
    <div className="appointments-wrapper">
      <h2>Crear Cita</h2>

      <div className="appointments-grid">
        <div className="appointments-left">
          <AppointmentForm
            key={editing?.id || `new-${prefillFromCalendar}`}
            onSubmit={saveAppointment}
            mascotas={MOCK_MASCOTAS}
            veterinarios={MOCK_VETERINARIOS}
            appointments={appointments}
            initialValues={editing ? {
              mascota_id: editing.mascota_id,
              veterinario_id: editing.veterinario_id,
              fecha_cita: new Date(editing.fecha_cita).toISOString().slice(0, 16),
              estado: editing.estado,
              notas: editing.notas || '',
              evidencia_url: editing.evidencia_url || '',
            } : {
              mascota_id: '',
              veterinario_id: '',
              fecha_cita: prefillFromCalendar,
              estado: 'Pendiente',
              notas: '',
              evidencia_url: '',
            }}
          />

          {/* Modal de confirmación */}
          {modalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Cita guardada correctamente</h3>
                <button onClick={() => setModalOpen(false)}>Cerrar</button>
              </div>
            </div>
          )}
        </div>

        <div className="appointments-right">
          <div className="calendar-card">
            <h3>Calendario</h3>
            <Calendar
              onClickDay={(date) => setSelectedDate(date)}
              value={selectedDate}
            />
            <p className="calendar-help">
              Haz clic en una fecha para prellenar el formulario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
