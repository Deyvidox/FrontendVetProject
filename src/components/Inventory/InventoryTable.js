import React, { useMemo, useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormSelect, CFormInput } from '@coreui/react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

// Función auxiliar para asignar clase CSS según estado
const stateClass = (estado) => `tag tag-${estado.toLowerCase()}`;

const InventoryTable = ({ inventory, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Filtrado optimizado con useMemo
  const filteredInventory = useMemo(() =>
    inventory.filter(item =>
      (filtroEstado === 'Todos' || item.estado === filtroEstado) &&
      (filtroTipo === 'Todos' || item.tipo === filtroTipo) &&
      (!busquedaActiva || !search.trim() || item.nombre.toLowerCase().includes(search.toLowerCase()))
    )
  , [inventory, filtroEstado, filtroTipo, search, busquedaActiva]);

  // Colores de estado
  const getStateColor = (estado) => {
    if (estado === 'Disponible') return 'text-success';
    if (estado === 'Agotado') return 'text-danger';
    return 'text-secondary';
  };

  // Exportar PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Inventario', 14, 18);
    let y = 28;

    filteredInventory.forEach((item, idx) => {
      doc.setFontSize(11);
      doc.text(`${idx + 1}. Nombre: ${item.nombre} | Tipo: ${item.tipo} | Estado: ${item.estado}`, 14, y);
      y += 6;
      doc.text(`Cantidad: ${item.cantidad} | Precio: ${item.precio_unitario.toFixed(2)}`, 14, y);
      y += 8;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save('inventario.pdf');
  };

  // Exportar Excel
  const exportXLS = () => {
    const data = filteredInventory.map(item => ({
      Nombre: item.nombre,
      Tipo: item.tipo,
      Cantidad: item.cantidad,
      Precio: item.precio_unitario.toFixed(2),
      Estado: item.estado,
      Instrucciones: item.instrucciones || '',
      Tags: item.tags?.join(', ') || ''
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Inventario');
    XLSX.writeFile(wb, 'inventario.xlsx');
  };

  return (
    <div className="inventory-list-section">
      <h3 className="list-title">Lista de Productos</h3>
      <p className="list-summary">Se muestran {filteredInventory.length} productos.</p>

      <div className="d-flex gap-2 mb-3">
        <CFormInput
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setBusquedaActiva(!busquedaActiva)}>
          {busquedaActiva ? 'Desactivar búsqueda' : 'Buscar'}
        </button>

        <CFormSelect value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Medicina">Medicina</option>
          <option value="Vacuna">Vacuna</option>
          <option value="Accesorio">Accesorio</option>
          <option value="Alimento">Alimento</option>
          <option value="Otro">Otro</option>
        </CFormSelect>

        <CFormSelect value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Disponible">Disponible</option>
          <option value="Agotado">Agotado</option>
          <option value="Descontinuado">Descontinuado</option>
        </CFormSelect>

        <button onClick={exportPDF}>PDF</button>
        <button onClick={exportXLS}>Excel</button>
      </div>

      <CTable bordered hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Tipo</CTableHeaderCell>
            <CTableHeaderCell>Cantidad</CTableHeaderCell>
            <CTableHeaderCell>Precio</CTableHeaderCell>
            <CTableHeaderCell>Estado</CTableHeaderCell>
            <CTableHeaderCell>Tags</CTableHeaderCell>
            <CTableHeaderCell>Imagen</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredInventory.map(item => (
            <CTableRow key={item.id}>
              <CTableDataCell>{item.nombre}</CTableDataCell>
              <CTableDataCell>{item.tipo}</CTableDataCell>
              <CTableDataCell>{item.cantidad}</CTableDataCell>
              <CTableDataCell>{item.precio_unitario.toFixed(2)}</CTableDataCell>
              <CTableDataCell className={getStateColor(item.estado)}>{item.estado}</CTableDataCell>
              <CTableDataCell>{item.tags?.join(', ')}</CTableDataCell>
              <CTableDataCell>
                {item.imagen_url && <img src={item.imagen_url} alt="Producto" width="50" />}
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="warning" size="sm" onClick={() => onEdit(item)}>Editar</CButton>
                <CButton color="danger" size="sm" className="ms-1" onClick={() => onDelete(item.id)}>Eliminar</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default InventoryTable;
