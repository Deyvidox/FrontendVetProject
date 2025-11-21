// InventoryPage.jsx
import React, { useState } from 'react'
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import InventoryForm from './InventoryForm'
import InventoryTable from './InventoryTable'
import '../../css/Inventory/inventory.css';

const InventoryPage = () => {
  // Estado de inventario
  const [inventory, setInventory] = useState([
    {
      id: 1,
      nombre: 'Vacuna Antirrábica',
      tipo: 'Vacuna',
      cantidad: 50,
      precio_unitario: 15.0,
      estado: 'Disponible',
      instrucciones: 'Mantener refrigerada',
      tags: ['importada', 'refrigerada'],
      imagen_url: '',
    },
  ])

  const [showModal, setShowModal] = useState(false) // Modal del formulario
  const [editProduct, setEditProduct] = useState(null) // Producto a editar

  // Función para agregar o editar producto
  const handleSave = (product) => {
    if (editProduct) {
      // Editar producto existente
      setInventory((prev) =>
        prev.map((item) => (item.id === editProduct.id ? { ...product, id: editProduct.id } : item))
      )
    } else {
      // Crear nuevo producto
      setInventory((prev) => [...prev, { ...product, id: Date.now() }])
    }
    setShowModal(false)
    setEditProduct(null)
  }

  // Función para abrir modal de edición
  const handleEdit = (product) => {
    setEditProduct(product)
    setShowModal(true)
  }

  // Función para eliminar producto
  const handleDelete = (id) => {
    if (window.confirm('¿Desea eliminar este producto?')) {
      setInventory((prev) => prev.filter((item) => item.id !== id))
    }
  }
  return (
    <div className="container">
      <CButton color="primary" className="add-product-btn" onClick={() => setShowModal(true)}>
        Agregar Producto
      </CButton>

      <InventoryTable inventory={inventory} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal del formulario */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{editProduct ? 'Editar Producto' : 'Agregar Producto'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <InventoryForm
            onSubmit={handleSave}
            initialValues={editProduct || undefined} // Si es null, el formulario usará defaults
            onClose={() => setShowModal(false)}
          />
        </CModalBody>
      </CModal>
    </div>
  )
}

export default InventoryPage
