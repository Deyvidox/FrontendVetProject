import React, { useState, useEffect } from 'react';
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import InventoryForm from './InventoryForm';
import InventoryTable from './InventoryTable';
import AlertModal from './AlertModal';
import '../../css/Inventory/inventory.css';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        // Aquí irá la conexión a tu backend
        // Ejemplo: const res = await fetch('tu-backend-url/api/inventory');
        // setInventory(res.data);
        
        setInventory([]);
      } catch (err) {
        console.error('Error al cargar inventario', err);
        setAlertMsg('Error al cargar inventario');
        setAlertType('error');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleSave = async (product) => {
    setLoading(true);
    try {
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

      // Aquí irá la conexión a tu backend
      if (editProduct) {
        // Ejemplo: await fetch(`tu-backend-url/api/inventory/${editProduct.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload)
        // });
        
        setAlertMsg('Producto actualizado correctamente');
      } else {
        // Ejemplo: await fetch('tu-backend-url/api/inventory', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload)
        // });
        
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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Desea eliminar este producto?')) {
      setLoading(true);
      try {
        // Aquí irá la conexión a tu backend
        // Ejemplo: await fetch(`tu-backend-url/api/inventory/${id}`, { method: 'DELETE' });
        
        setInventory(prev => prev.filter(item => item.id !== id));
        setAlertMsg('Producto eliminado correctamente');
        setAlertType('success');
        setAlertOpen(true);
      } catch (err) {
        console.error('Error al eliminar producto', err);
        setAlertMsg('Error al eliminar producto');
        setAlertType('error');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <CButton 
        color="primary" 
        className="add-product-btn" 
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Agregar Producto"}
      </CButton>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando inventario...</p>
        </div>
      ) : (
        <InventoryTable
          inventory={inventory}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

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

      <AlertModal
        isOpen={alertOpen}
        message={alertMsg}
        type={alertType}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default InventoryPage;