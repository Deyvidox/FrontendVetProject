import React, { useEffect, useState, useCallback } from "react";
import { getInventoryRequest, deleteProductRequest } from "./inventoryService";
import { useNavigate } from "react-router-dom";
import InventoryTable from "./InventoryTable";
import { CButton, CRow, CCol, CFormInput, CFormSelect, CSpinner, CAlert } from '@coreui/react';

function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados para los filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    
    const navigate = useNavigate();

    // Función de carga envuelta en useCallback para evitar renders infinitos
    const loadInventory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                search: searchTerm.trim() || undefined,
                type: categoryFilter || undefined
            };
            
            const response = await getInventoryRequest(params);
            
            if (response.success) {
                setInventory(response.data);
            } else {
                setError("No se pudo obtener la lista de productos.");
            }
        } catch (err) {
            console.error("Error al cargar inventario:", err);
            setError("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, categoryFilter]);

    // Efecto con Debounce: Espera 400ms tras dejar de escribir para consultar al API
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadInventory();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [loadInventory]);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
            try {
                const res = await deleteProductRequest(id);
                if (res.success) {
                    // Recargar la lista tras eliminar
                    loadInventory();
                } else {
                    alert(res.message || "Error al eliminar.");
                }
            } catch (err) {
                alert(err.response?.data?.message || "Error al procesar la eliminación.");
            }
        }
    };

    return (
        <div className="container-fluid p-4">
            {/* Cabecera y Filtros */}
            <CRow className="mb-4 align-items-center">
                <CCol md={4}>
                    <h3 className="text-white mb-0">Gestión de Inventario</h3>
                </CCol>
                <CCol md={8} className="d-flex gap-2 justify-content-end flex-wrap">
                    <CFormInput 
                        type="text"
                        placeholder="Buscar por nombre..." 
                        style={{ maxWidth: '280px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <CFormSelect 
                        style={{ maxWidth: '200px' }}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">Todas las Categorías</option>
                        <option value="Medicine">Medicamentos</option>
                        <option value="Vaccine">Vacunas</option>
                        <option value="Accessory">Accesorios</option>
                        <option value="Food">Alimentos</option>
                        <option value="Other">Otros</option>
                    </CFormSelect>
                    <CButton color="primary" onClick={() => navigate('/inventory/add')}>
                        + Nuevo Producto
                    </CButton>
                </CCol>
            </CRow>

            {/* Alertas de Error */}
            {error && (
                <CAlert color="danger" className="mb-4">
                    {error}
                </CAlert>
            )}

            {/* Contenido Principal */}
            <CRow>
                <CCol xs={12}>
                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner color="light" size="xl" />
                            <p className="text-light mt-3">Sincronizando inventario...</p>
                        </div>
                    ) : (
                        <InventoryTable 
                            inventory={inventory} 
                            onDelete={handleDelete}
                            onEdit={(item) => navigate(`/inventory/edit/${item.id}`)}
                        />
                    )}
                </CCol>
            </CRow>
        </div>
    );
}

export default InventoryPage;