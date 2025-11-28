import React, { useState, useEffect } from 'react';
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import axios from 'axios';
import InventoryForm from './InventoryForm';
import InventoryTable from './../InventoryTable';
import '../../css/Inventory/inventory.css';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Cargar inventario desde JSON Server
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get('http://localhost:3000/inventory');
        setInventory(res.data);
      } catch (err) {
        console.error('Error al cargar inventario', err);
        setAlertMsg('Error al cargar inventario');
        setAlertType('error');
        setAlertOpen(true);
      }
    };
    fetchInventory();
  }, []);

  // Crear o editar producto
  const handleSave = async (product) => {
    try {
      // Inicializar campos opcionales para evitar problemas
      const payload = {
        nombre: product.nombre || '',
        tipo: product.tipo || 'Otro',
        instrucciones: product.instrucciones || '',
        cantidad: product.cantidad || 0,
        precio_unitario: product.precio_unitario || 0,
        estado: product.estado || 'Disponible',
        tags: product.tags || [],
        imagen_url: product.imagen_url || '',
      };

      if (editProduct) {
        // Editar producto existente
        const res = await axios.put(`http://localhost:3001/inventory/${editProduct.id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        setInventory(prev =>
          prev.map(item => (item.id === editProduct.id ? res.data : item))
        );
        setAlertMsg('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        const res = await axios.post('http://localhost:3001/inventory', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        setInventory(prev => [...prev, res.data]);
        setAlertMsg('Producto agregado correctamente');
      }

      setAlertType('success');
      setAlertOpen(true);
      setShowModal(false);
      setEditProduct(null);

    } catch (err) {
      console.error('Error al guardar producto', err);
      setAlertMsg('Error al guardar producto');
      setAlertType('error');
      setAlertOpen(true);
    }
  };

  // Abrir modal de edición
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Desea eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:3001/inventory/${id}`);
        setInventory(prev => prev.filter(item => item.id !== id));
        setAlertMsg('Producto eliminado correctamente');
        setAlertType('success');
        setAlertOpen(true);
      } catch (err) {
        console.error('Error al eliminar producto', err);
        setAlertMsg('Error al eliminar producto');
        setAlertType('error');
        setAlertOpen(true);
      }
    }
  };

  return (
    <div className="container">
      <CButton color="primary" className="add-product-btn" onClick={() => setShowModal(true)}>
        Agregar Producto
      </CButton>

      <InventoryTable
        inventory={inventory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{editProduct ? 'Editar Producto' : 'Agregar Producto'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <InventoryForm
            onSubmit={handleSave}
            initialValues={editProduct || undefined}
            onClose={() => setShowModal(false)}
          />
        </CModalBody>
      </CModal>
    </div>
  );
};

export default InventoryPage;
