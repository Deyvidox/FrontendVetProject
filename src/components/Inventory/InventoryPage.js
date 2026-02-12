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

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadInventory();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [loadInventory]);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            try {
                const res = await deleteProductRequest(id);
                if (res.success) {
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
        <div className="container-fluid p-4" style={{ minHeight: '100vh' }}>
            {/* Cabecera Estilizada */}
            <CRow className="mb-4 align-items-center">
                <CCol md={5}>
                    <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-3 p-2 me-3 shadow">
                            <span className="fs-4 text-white">📦</span>
                        </div>
                        <div>
                            <h3 className="text-white fw-bold mb-0">Gestión de Inventario</h3>
                            <p className="text-info small mb-0">Control de stock y suministros médicos</p>
                        </div>
                    </div>
                </CCol>
                
                <CCol md={7} className="d-flex gap-2 justify-content-end flex-wrap mt-3 mt-md-0">
                    <CFormInput 
                        type="text"
                        placeholder="🔍 Buscar producto..." 
                        className="border-0 shadow-sm bg-dark text-white p-2 px-3 rounded-pill"
                        style={{ maxWidth: '280px', border: '1px solid #3b3b5e' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <CFormSelect 
                        className="border-0 shadow-sm bg-dark text-white p-2 rounded-pill cursor-pointer"
                        style={{ maxWidth: '200px', border: '1px solid #3b3b5e' }}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">📁 Todas las Categorías</option>
                        <option value="Medicine">Medicamentos</option>
                        <option value="Vaccine">Vacunas</option>
                        <option value="Accessory">Accesorios</option>
                        <option value="Food">Alimentos</option>
                        <option value="Other">Otros</option>
                    </CFormSelect>
                    <CButton 
                        color="primary" 
                        className="px-4 fw-bold rounded-pill shadow-sm"
                        onClick={() => navigate('/inventory/add')}
                    >
                        + Nuevo Producto
                    </CButton>
                </CCol>
            </CRow>

            {/* Alertas con estilo */}
            {error && (
                <CAlert color="danger" className="border-0 shadow mb-4">
                    <strong>¡Atención!</strong> {error}
                </CAlert>
            )}

            {/* Contenedor Principal de la Tabla */}
            <CRow>
                <CCol xs={12}>
                    {loading ? (
                        <div className="text-center py-5 rounded shadow" style={{ backgroundColor: '#0d0e0b' }}>
                            <CSpinner color="info" variant="grow" size="xl" />
                            <p className="text-info mt-3 fw-semibold">Sincronizando inventario en tiempo real...</p>
                        </div>
                    ) : (
                        <div className="shadow-lg">
                            <InventoryTable 
                                inventory={inventory} 
                                onDelete={handleDelete}
                                onEdit={(item) => navigate(`/inventory/edit/${item.id}`)}
                            />
                        </div>
                    )}
                </CCol>
            </CRow>
        </div>
    );
}

export default InventoryPage;