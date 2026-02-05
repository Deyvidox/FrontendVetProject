import React, { useMemo, useState } from 'react';
import { 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell, 
  CButton, 
  CFormSelect, 
  CFormInput 
} from '@coreui/react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import '../../css/Inventory/inventory.css';

const stateClass = (estado) => `tag tag-${estado.toLowerCase()}`;

const AppointmentList = ({ appointments, onEdit, onDelete, onUpdateStatus }) => {
  const [search, setSearch] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const normalized = useMemo(
    () =>
      (appointments || []).map((a) => ({
        ...a,
        fechaLabel: a.fecha_cita ? new Date(a.fecha_cita).toLocaleString() : '-',
        mascotaNombre: a.mascota?.nombre || '-',
        veterinarioNombre: a.veterinario?.nombre || '-',
        clienteNombre: a.cliente?.nombre || '-',
      })),
    [appointments]
  );

  const filteredAppointments = useMemo(
    () =>
      normalized.filter((a) =>
        (filtroEstado === 'Todos' || a.estado === filtroEstado) &&
        (!busquedaActiva ||
          !search.trim() ||
          a.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
          a.mascotaNombre.toLowerCase().includes(search.toLowerCase()) ||
          a.veterinarioNombre.toLowerCase().includes(search.toLowerCase()))
      ),
    [normalized, filtroEstado, search, busquedaActiva]
  );

  const deleteAppointment = async (id) => { 
    if(onDelete) await onDelete(id); 
  };

  const updateStatus = async (id, newStatus) => { 
    if(onUpdateStatus) await onUpdateStatus(id, newStatus); 
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Citas', 14, 18);
    let y = 28;
    filteredAppointments.forEach((i, idx) => {
      doc.setFontSize(11);
      doc.text(`${idx + 1}. Cliente: ${i.clienteNombre} | Mascota: ${i.mascotaNombre} | Veterinario: ${i.veterinarioNombre}`, 14, y);
      y += 6;
      doc.text(`Fecha: ${i.fechaLabel} | Estado: ${i.estado}`, 14, y);
      y += 10;
      if(y > 270){ doc.addPage(); y = 20; }
    });
    doc.save('citas.pdf');
  };

  const exportXLS = () => {
    const data = filteredAppointments.map(i => ({
      Cliente: i.clienteNombre,
      Mascota: i.mascotaNombre,
      Veterinario: i.veterinarioNombre,
      Fecha: i.fechaLabel,
      Estado: i.estado,
      Notas: i.notas || '',
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Citas');
    XLSX.writeFile(wb, 'citas.xlsx');
  };

  return (
    <div className="inventory-list-section">
      <h3 className="list-title">Lista de Citas</h3>
      <p className="list-summary">Se muestran {filteredAppointments.length} citas.</p>

      <div className="d-flex gap-2 mb-3">
        <CFormInput 
          placeholder="Buscar por cliente, mascota o veterinario" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <button onClick={() => setBusquedaActiva(!busquedaActiva)}>
          {busquedaActiva ? 'Desactivar búsqueda' : 'Buscar'}
        </button>
        <CFormSelect value={filtroEstado} onChange={(e)=>setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Confirmada">Confirmada</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Completada">Completada</option>
        </CFormSelect>
        <button onClick={exportPDF}>PDF</button>
        <button onClick={exportXLS}>Excel</button>
      </div>

      <CTable bordered hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Cliente</CTableHeaderCell>
            <CTableHeaderCell>Mascota</CTableHeaderCell>
            <CTableHeaderCell>Veterinario</CTableHeaderCell>
            <CTableHeaderCell>Fecha</CTableHeaderCell>
            <CTableHeaderCell>Estado</CTableHeaderCell>
            <CTableHeaderCell>Notas</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredAppointments.map(appt => (
            <CTableRow key={appt.id}>
              <CTableDataCell>{appt.clienteNombre}</CTableDataCell>
              <CTableDataCell>{appt.mascotaNombre}</CTableDataCell>
              <CTableDataCell>{appt.veterinarioNombre}</CTableDataCell>
              <CTableDataCell>{appt.fechaLabel}</CTableDataCell>
              <CTableDataCell className={stateClass(appt.estado)}>
                {appt.estado}
              </CTableDataCell>
              <CTableDataCell>{appt.notas || '-'}</CTableDataCell>
              <CTableDataCell>
                <CFormSelect 
                  size="sm" 
                  value={appt.estado} 
                  onChange={(e) => updateStatus(appt.id, e.target.value)}
                  className="mb-1"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Completada">Completada</option>
                </CFormSelect>
                <CButton color="warning" size="sm" onClick={() => onEdit && onEdit(appt)}>
                  Editar
                </CButton>
                <CButton color="danger" size="sm" className="ms-1" onClick={() => deleteAppointment(appt.id)}>
                  Eliminar
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default AppointmentList;