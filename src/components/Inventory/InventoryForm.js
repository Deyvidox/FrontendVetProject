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

    // 1. CARGA DE DATOS (Modo Edición)
    useEffect(() => {
        if (id) {
            const loadProductData = async () => {
                setFetching(true);
                try {
                    // Buscamos por ID usando nuestro servicio
                    const res = await getInventoryRequest({ id });
                    if (res?.success && res?.data) {
                        const p = Array.isArray(res.data) ? res.data[0] : res.data;
                        
                        // Mapeamos los valores de la DB al formulario
                        setValue('name', p.name || '');
                        setValue('type', p.type || '');
                        setValue('status', p.status || 'Available');
                        setValue('quantity', p.quantity || 0);
                        setValue('unit_price', p.unit_price || 0);
                        setValue('instructions', p.instructions || '');
                    }
                } catch (error) {
                    console.error("Error al obtener producto:", error);
                    setErrorMsg("No se pudo cargar la información del producto.");
                } finally {
                    setFetching(false);
                }
            };
            loadProductData();
        }
    }, [id, setValue]);

    // 2. ENVÍO DE DATOS
    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMsg(null);
        try {
            // Estructuramos el objeto antes de enviarlo
            const payload = {
                ...data,
                // Aseguramos que la imagen se pase como el array de archivos de React Hook Form
                imagen: data.imagen
            };

            const res = id 
                ? await updateProductRequest(id, payload) 
                : await createProductRequest(payload);
            
            if (res?.success) {
                navigate('/inventory');
            } else {
                setErrorMsg(res?.message || "Error al guardar en el servidor");
            }
        } catch (error) {
            console.error("Error en submit:", error);
            setErrorMsg(error.response?.data?.message || "Error crítico de conexión");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="d-flex flex-column align-items-center py-5">
                <CSpinner color="primary" variant="grow" size="lg" />
                <p className="text-white mt-3">Cargando datos del producto...</p>
            </div>
        );
    }

    return (
        <CRow className="justify-content-center p-3">
            <CCol md={8} lg={6}>
                <CCard className="shadow-lg border-0 bg-dark text-white">
                    <CCardHeader className="bg-primary text-white py-3">
                        <h5 className="mb-0">
                            {id ? `Editando Producto: #${id}` : 'Nuevo Registro de Inventario'}
                        </h5>
                    </CCardHeader>
                    <CCardBody className="p-4">
                        {errorMsg && <CAlert color="danger">{errorMsg}</CAlert>}
                        
                        <CForm onSubmit={handleSubmit(onSubmit)}>
                            {/* Nombre */}
                            <div className="mb-3">
                                <CFormInput
                                    label="Nombre del Producto"
                                    className="bg-dark"
                                    placeholder="Ej. Antipulgas Nexgard"
                                    {...register('name', { required: "El nombre es obligatorio" })}
                                    invalid={!!errors.name}
                                    feedback={errors.name?.message}
                                />
                            </div>
                            
                            <CRow>
                                {/* Categoría */}
                                <CCol md={6} className="mb-3">
                                    <CFormSelect 
                                        label="Categoría" 
                                        {...register('type', { required: "Seleccione una categoría" })}
                                        invalid={!!errors.type}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Medicine">Medicamento</option>
                                        <option value="Vaccine">Vacuna</option>
                                        <option value="Accessory">Accesorio</option>
                                        <option value="Food">Alimento</option>
                                        <option value="Other">Otro</option>
                                    </CFormSelect>
                                </CCol>
                                {/* Estado */}
                                <CCol md={6} className="mb-3">
                                    <CFormSelect label="Estado" {...register('status', { required: true })}>
                                        <option value="Available">Disponible</option>
                                        <option value="Out of Stock">Agotado</option>
                                        <option value="Discontinued">caducado</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>

                            <CRow>
                                {/* Cantidad */}
                                <CCol md={6} className="mb-3">
                                    <CFormInput 
                                        label="Stock Disponible" 
                                        type="number" 
                                        {...register('quantity', { required: true, min: 0 })} 
                                    />
                                </CCol>
                                {/* Precio */}
                                <CCol md={6} className="mb-3">
                                    <CFormInput 
                                        label="Precio Unitario ($)" 
                                        type="number" 
                                        step="0.01" 
                                        {...register('unit_price', { required: true, min: 0 })} 
                                    />
                                </CCol>
                            </CRow>

                            {/* Instrucciones */}
                            <div className="mb-3">
                                <CFormTextarea 
                                    label="Instrucciones / Descripción" 
                                    rows={3} 
                                    {...register('instructions')} 
                                    placeholder="Indicaciones de uso o notas..."
                                />
                            </div>

                            {/* Imagen */}
                            <div className="mb-4">
                                <CFormInput 
                                    label="Imagen del Producto" 
                                    type="file" 
                                    {...register('imagen')} 
                                    accept="image/*"
                                />
                                {id && (
                                    <div className="mt-2">
                                        <small className="text-info">
                                            ℹ️ Deja este campo vacío para mantener la imagen actual.
                                        </small>
                                    </div>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="d-flex justify-content-end gap-2 border-top pt-3">
                                <CButton color="secondary" variant="outline" onClick={() => navigate('/inventory')}>
                                    Cancelar
                                </CButton>
                                <CButton type="submit" color="primary" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <CSpinner component="span" size="sm" variant="grow" className="me-2" />
                                            Guardando...
                                        </>
                                    ) : (
                                        id ? 'Actualizar Producto' : 'Registrar Producto'
                                    )}
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default InventoryForm;