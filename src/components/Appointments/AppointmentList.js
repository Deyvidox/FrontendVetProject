import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import '../../css/appointment/appointmentList.css';

// Clase CSS según estado
const stateClass = (estado) => `tag tag-${estado.toLowerCase()}`;

const AppointmentList = () => {
  // Datos simulados
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
      fecha_cita: '2025-02-01T10:00',
      estado: 'Pendiente',
      notas: 'Revisión general',
    },
    {
      id: 2,
      mascota_id: 2,
      veterinario_id: 102,
      fecha_cita: '2025-02-01T11:00',
      estado: 'Confirmada',
      notas: '',
    },
    {
      id: 3,
      mascota_id: 3,
      veterinario_id: 101,
      fecha_cita: '2025-02-02T09:30',
      estado: 'Completada',
      notas: 'Consulta dermatológica',
    },
  ];

  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Índices rápidos
  const indexClientes = useMemo(() => Object.fromEntries(MOCK_CLIENTES.map(c => [c.id, c])), []);
  const indexMascotas = useMemo(() => Object.fromEntries(MOCK_MASCOTAS.map(m => [m.id, m])), []);
  const indexVets = useMemo(() => Object.fromEntries(MOCK_VETS.map(v => [v.id, v])), []);

  // Normalizar citas
  const normalized = useMemo(() => 
    appointments.map(a => ({
      ...a,
      cliente: indexClientes[indexMascotas[a.mascota_id]?.cliente_id],
      mascota: indexMascotas[a.mascota_id],
      vet: indexVets[a.veterinario_id],
      fechaLabel: new Date(a.fecha_cita).toLocaleString(),
    }))
  , [appointments, indexClientes, indexMascotas, indexVets]);

  // Filtrado
  const filteredAppointments = useMemo(() => 
    normalized.filter(a =>
      (filtroEstado === 'Todos' || a.estado === filtroEstado) &&
      (!busquedaActiva || !search.trim() ||
        a.cliente?.nombre.toLowerCase().includes(search.toLowerCase()) ||
        a.mascota?.nombre.toLowerCase().includes(search.toLowerCase()) ||
        a.vet?.nombre.toLowerCase().includes(search.toLowerCase())
      )
    )
  , [normalized, filtroEstado, search, busquedaActiva]);

  // Funciones CRUD básicas
  const deleteAppointment = (id) => {
    if (!window.confirm('¿Eliminar esta cita?')) return;
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const updateStatus = (id, newStatus) => {
    setAppointments(
      appointments.map(a => a.id === id ? { ...a, estado: newStatus } : a)
    );
  };

  // Exportar PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Citas', 14, 18);
    let y = 28;

    filteredAppointments.forEach((i, idx) => {
      doc.setFontSize(11);
      doc.text(
        `${idx + 1}. Cliente: ${i.cliente?.nombre || '-'} | Mascota: ${i.mascota?.nombre || '-'} | Vet: ${i.vet?.nombre || '-'}`,
        14,
        y
      );
      y += 6;
      doc.text(`Fecha: ${i.fechaLabel} | Estado: ${i.estado}`, 14, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('citas.pdf');
  };

  // Exportar Excel
  const exportXLS = () => {
    const data = filteredAppointments.map(i => ({
      Cliente: i.cliente?.nombre || '-',
      Mascota: i.mascota?.nombre || '-',
      Veterinario: i.vet?.nombre || '-',
      Fecha: i.fechaLabel,
      Estado: i.estado,
      Notas: i.notas || '',
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Citas');
    XLSX.writeFile(wb, 'citas.xlsx');
  };

  return (
    <div className="appointment-list-section">
      <h3 className="list-title">Lista de Citas</h3>
      <p className="list-summary">
        Se muestran {filteredAppointments.length} citas.
      </p>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por cliente, mascota o veterinario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setBusquedaActiva(!busquedaActiva)}>
          {busquedaActiva ? 'Desactivar búsqueda' : 'Buscar'}
        </button>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Confirmada">Confirmada</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Completada">Completada</option>
        </select>

        <button onClick={exportPDF}>PDF</button>
        <button onClick={exportXLS}>Excel</button>
      </div>

      <div className="appointment-list">
        {filteredAppointments.length === 0 && (
          <div className="no-results">No hay citas.</div>
        )}

        {filteredAppointments.map((appt) => (
          <div key={appt.id} className="appointment-card">
            <div className="appointment-head">
              <div className="profile">
                <p><strong>Cliente:</strong> {appt.cliente?.nombre || '-'}</p>
                <p><strong>Mascota:</strong> {appt.mascota?.nombre || '-'}</p>
                <p><strong>Veterinario:</strong> {appt.vet?.nombre || '-'}</p>
              </div>
              <span className={stateClass(appt.estado)}>{appt.estado}</span>
            </div>
            <p><strong>Fecha:</strong> {appt.fechaLabel}</p>
            {appt.notas && <p><strong>Notas:</strong> {appt.notas}</p>}
            <div className="card-actions">
              <label>Estado:</label>
              <select
                value={appt.estado}
                onChange={(e) => updateStatus(appt.id, e.target.value)}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Completada">Completada</option>
              </select>
              <button onClick={() => deleteAppointment(appt.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;
