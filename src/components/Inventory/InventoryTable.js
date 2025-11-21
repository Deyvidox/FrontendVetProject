// InventoryTable.jsx
// Componente que muestra el inventario de productos de dos formas:
// 1) Una tabla tradicional para visualizar rápidamente todos los datos.
// 2) Una vista tipo tarjetas para una presentación más visual y detallada.
// Incluye filtros, búsqueda, y opciones de exportación a PDF y Excel.
// También permite editar o eliminar productos directamente desde la tabla o las tarjetas.

import React, { useMemo, useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormSelect, CFormInput } from '@coreui/react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import '../../css/Inventory/inventory.css'; // Estilos específicos del inventario

// Función auxiliar que asigna una clase CSS a un producto según su estado
// Ejemplo: "Disponible" -> "tag tag-disponible"
// Esto nos permite colorear de manera diferente cada estado (verde, rojo, gris)
const stateClass = (estado) => `tag tag-${estado.toLowerCase()}`;

const InventoryTable = ({ inventory, onEdit, onDelete }) => {
  // Estados locales del componente

  const [search, setSearch] = useState(''); // Texto que ingresa el usuario para buscar por nombre
  const [busquedaActiva, setBusquedaActiva] = useState(false); // Indica si la búsqueda debe aplicarse
  const [filtroEstado, setFiltroEstado] = useState('Todos'); // Filtro para mostrar productos por estado
  const [filtroTipo, setFiltroTipo] = useState('Todos'); // Filtro para mostrar productos por tipo

  // Creamos el inventario filtrado usando useMemo para optimizar el rendimiento
  // Se recalcula solo cuando cambian inventory, filtros o búsqueda
  const filteredInventory = useMemo(() =>
    inventory.filter(item =>
      // Validamos estado: si es "Todos", dejamos pasar todos, si no, solo coincidencias
      (filtroEstado === 'Todos' || item.estado === filtroEstado) &&
      // Validamos tipo: si es "Todos", dejamos pasar todos, si no, solo coincidencias
      (filtroTipo === 'Todos' || item.tipo === filtroTipo) &&
      // Validamos búsqueda: si la búsqueda está activa y hay texto, buscamos coincidencias en nombre
      (!busquedaActiva || !search.trim() || item.nombre.toLowerCase().includes(search.toLowerCase()))
    )
  , [inventory, filtroEstado, filtroTipo, search, busquedaActiva]);

  // Función que devuelve la clase CSS del texto según el estado
  // Verde = Disponible, Rojo = Agotado, Gris = Descontinuado u otros
  const getStateColor = (estado) => {
    if (estado === 'Disponible') return 'text-success';
    if (estado === 'Agotado') return 'text-danger';
    return 'text-secondary';
  };

  // Función para exportar los productos filtrados a PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Inventario', 14, 18);
    let y = 28; // Posición vertical inicial

    // Recorremos cada producto y agregamos la información al PDF
    filteredInventory.forEach((item, idx) => {
      doc.setFontSize(11);
      doc.text(`${idx + 1}. Nombre: ${item.nombre} | Tipo: ${item.tipo} | Estado: ${item.estado}`, 14, y);
      y += 6;
      doc.text(`Cantidad: ${item.cantidad} | Precio: ${item.precio_unitario.toFixed(2)}`, 14, y);
      y += 8;

      // Si llegamos al final de la página, agregamos una nueva para no cortar información
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save('inventario.pdf'); // Descarga el archivo
  };

  // Función para exportar los productos filtrados a Excel
  const exportXLS = () => {
    // Creamos un arreglo con objetos simples para Excel
    const data = filteredInventory.map(item => ({
      Nombre: item.nombre,
      Tipo: item.tipo,
      Cantidad: item.cantidad,
      Precio: item.precio_unitario.toFixed(2),
      Estado: item.estado,
      Instrucciones: item.instrucciones || '',
      Tags: item.tags?.join(', ') || ''
    }));

    const wb = XLSX.utils.book_new(); // Creamos un libro de Excel
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Inventario'); // Creamos la hoja
    XLSX.writeFile(wb, 'inventario.xlsx'); // Descargamos el archivo
  };

  return (
    <div className="inventory-list-section">
      {/* Título y resumen de la lista */}
      <h3 className="list-title">Lista de Productos</h3>
      <p className="list-summary">Se muestran {filteredInventory.length} productos.</p>

      {/* Sección de filtros y búsqueda */}
      <div className="d-flex gap-2 mb-3">
        {/* Campo de búsqueda por nombre */}
        <CFormInput
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setBusquedaActiva(!busquedaActiva)}>
          {busquedaActiva ? 'Desactivar búsqueda' : 'Buscar'}
        </button>

        {/* Filtro por tipo de producto */}
        <CFormSelect value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Medicina">Medicina</option>
          <option value="Vacuna">Vacuna</option>
          <option value="Accesorio">Accesorio</option>
          <option value="Alimento">Alimento</option>
          <option value="Otro">Otro</option>
        </CFormSelect>

        {/* Filtro por estado del producto */}
        <CFormSelect value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Disponible">Disponible</option>
          <option value="Agotado">Agotado</option>
          <option value="Descontinuado">Descontinuado</option>
        </CFormSelect>

        {/* Botones para exportar la lista */}
        <button onClick={exportPDF}>PDF</button>
        <button onClick={exportXLS}>Excel</button>
      </div>

      {/* Tabla tradicional */}
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
                {/* Botones de acción */}
                <CButton color="warning" size="sm" onClick={() => onEdit(item)}>Editar</CButton>
                <CButton color="danger" size="sm" className="ms-1" onClick={() => onDelete(item.id)}>Eliminar</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Vista tipo tarjetas para una presentación más visual */}
      <div className="inventory-cards mt-3">
        {filteredInventory.map(item => (
          <div key={item.id} className="inventory-card">
            <div className="inventory-head">
              <p><strong>Nombre:</strong> {item.nombre}</p>
              <p><strong>Tipo:</strong> {item.tipo}</p>
              <span className={stateClass(item.estado)}>{item.estado}</span>
            </div>
            <p><strong>Cantidad:</strong> {item.cantidad}</p>
            <p><strong>Precio:</strong> {item.precio_unitario.toFixed(2)}</p>
            {item.instrucciones && <p><strong>Instrucciones:</strong> {item.instrucciones}</p>}
            {item.tags?.length > 0 && <p><strong>Tags:</strong> {item.tags.join(', ')}</p>}
            {item.imagen_url && <img src={item.imagen_url} alt={item.nombre} width="50" />}
            <div className="card-actions">
              {/* Botones de acción para cada tarjeta */}
              <button onClick={() => onEdit(item)}>Editar</button>
              <button onClick={() => onDelete(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryTable;
