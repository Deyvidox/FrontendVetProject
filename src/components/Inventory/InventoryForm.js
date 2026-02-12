import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createProductRequest, updateProductRequest, getInventoryRequest } from './inventoryService';
import { 
    CButton, CForm, CFormInput, CFormSelect, CFormTextarea, 
    CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner, CAlert 
} from '@coreui/react';

function InventoryForm() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            type: '',
            status: 'Available',
            quantity: 0,
            unit_price: 0,
            instructions: ''
        }
    });
    
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Carga de datos
    useEffect(() => {
        if (id) {
            const loadProductData = async () => {
                setFetching(true);
                try {
                    const res = await getInventoryRequest({ id });
                    if (res?.success && res?.data) {
                        const p = Array.isArray(res.data) ? res.data[0] : res.data;
                        setValue('name', p.name || '');
                        setValue('type', p.type || '');
                        setValue('status', p.status || 'Available');
                        setValue('quantity', p.quantity || 0);
                        setValue('unit_price', p.unit_price || 0);
                        setValue('instructions', p.instructions || '');
                    }
                } catch (error) {
                    setErrorMsg("No se pudo cargar la información del producto.");
                } finally {
                    setFetching(false);
                }
            };
            loadProductData();
        }
    }, [id, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const payload = { ...data }; 
            const res = id 
                ? await updateProductRequest(id, payload) 
                : await createProductRequest(payload);
            
            if (res?.success) {
                navigate('/inventory');
            } else {
                setErrorMsg(res?.message || "Error al guardar en el servidor");
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Error crítico de conexión");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="d-flex flex-column align-items-center py-5" style={{ minHeight: '60vh' }}>
                <CSpinner color="primary" variant="grow" size="xl" />
                <p className="text-primary mt-3 fw-bold">Sincronizando datos del producto...</p>
            </div>
        );
    }

    return (
        <CRow className="justify-content-center p-3 animate__animated animate__fadeIn">
            <CCol md={10} lg={8}>
                <CCard className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                    <CCardHeader className="bg-dark text-white py-3 border-0">
                        <div className="d-flex align-items-center">
                            <h5 className="mb-0 fw-bold">
                                📦 {id ? `Editar Producto: ${id}` : 'Nuevo Registro de Inventario'}
                            </h5>
                        </div>
                    </CCardHeader>
                    
                    <CCardBody className="p-4" style={{ backgroundColor: '#f9f9fb' }}>
                        {errorMsg && <CAlert color="danger" className="border-0 shadow-sm">{errorMsg}</CAlert>}
                        
                        <CForm onSubmit={handleSubmit(onSubmit)}>
                            <CRow className="g-3">
                                {/* Nombre */}
                                <CCol md={12}>
                                    <CFormLabel className="fw-semibold text-secondary small text-uppercase">Nombre del Producto</CFormLabel>
                                    <CFormInput
                                        className="shadow-sm border-0 p-2"
                                        placeholder="Ej. Antipulgas Nexgard"
                                        {...register('name', { required: "El nombre es obligatorio" })}
                                        invalid={!!errors.name}
                                    />
                                </CCol>
                                
                                {/* Categoría */}
                                <CCol md={6}>
                                    <CFormLabel className="fw-semibold text-secondary small text-uppercase">Categoría</CFormLabel>
                                    <CFormSelect 
                                        className="shadow-sm border-0 p-2"
                                        {...register('type', { required: "Seleccione una categoría" })}
                                        invalid={!!errors.type}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="Medicine">Medicamento</option>
                                        <option value="Vaccine">Vacuna</option>
                                        <option value="Accessory">Accesorio</option>
                                        <option value="Food">Alimento</option>
                                        <option value="Other">Otro</option>
                                    </CFormSelect>
                                </CCol>

                                {/* Estado */}
                                <CCol md={6}>
                                    <CFormLabel className="fw-semibold text-secondary small text-uppercase">Estado de Stock</CFormLabel>
                                    <CFormSelect 
                                        className="shadow-sm border-0 p-2"
                                        {...register('status', { required: true })}
                                    >
                                        <option value="Available">🟢 Disponible</option>
                                        <option value="Out of Stock">🔴 Agotado</option>
                                        <option value="Discontinued">🟠 Descontinuado</option>
                                    </CFormSelect>
                                </CCol>

                                {/* Cantidad */}
                                <CCol md={6}>
                                    <CFormLabel className="fw-semibold text-secondary small text-uppercase">Stock Inicial</CFormLabel>
                                    <CFormInput 
                                        className="shadow-sm border-0 p-2"
                                        type="number" 
                                        {...register('quantity', { required: true, min: 0 })} 
                                    />
                                </CCol>

                                {/* Precio */}
                                <CCol md={6}>
                                    <CFormLabel className="fw-semibold text-secondary small text-uppercase">Precio Unitario ($)</CFormLabel>
                                    <CFormInput 
                                        className="shadow-sm border-0 p-2"
                                        type="number" 
                                        step="0.01" 
                                        {...register('unit_price', { required: true, min: 0 })} 
                                    />
                                </CCol>

                                {/* Instrucciones */}
                                <CCol md={12}>
                                    <CFormLabel className="fw-semibold text-secondary small text-uppercase">Notas Adicionales</CFormLabel>
                                    <CFormTextarea 
                                        className="shadow-sm border-0 p-2"
                                        rows={3} 
                                        {...register('instructions')} 
                                        placeholder="Indicaciones de uso o notas técnicas..."
                                    />
                                </CCol>

                                {/* Imagen */}
                                <CCol md={12} className="mt-4">
                                    <div className="bg-white p-3 rounded shadow-sm border border-light">
                                        <CFormLabel className="fw-bold mb-2 text-dark">📸 Imagen del Producto</CFormLabel>
                                        <CFormInput 
                                            type="file" 
                                            accept="image/*"
                                            className="form-control-sm"
                                            {...register('imagen')} 
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            {/* Botones de Acción */}
                            <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                                <CButton 
                                      type="submit" 
                                    color="primary" 
                                    disabled={loading}
                                    className="px-5 py-2 shadow fw-bold rounded-pill"
                                    onClick={() => navigate('/inventory')}
                                >
                                    Descartar
                                </CButton>
                                <CButton 
                                    type="submit" 
                                    color="primary" 
                                    disabled={loading}
                                    className="px-5 py-2 shadow fw-bold rounded-pill"
                                >
                                    {loading ? 'Guardando...' : id ? 'Finalizar Cambios ✨' : 'Finalizar Registro ✨'}
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

const CFormLabel = ({ children, className }) => <label className={`form-label ${className}`}>{children}</label>;

export default InventoryForm;