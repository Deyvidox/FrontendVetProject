import React, { useState, useEffect } from 'react';
import { 
  CCard, CCardHeader, CCardBody, CForm, CFormInput, CFormLabel, 
  CFormSelect, CButton, CRow, CCol, CAlert, CSpinner, CAvatar 
} from '@coreui/react';
import { createPet } from './PetService';

const RegisterPet = () => {
  const [formData, setFormData] = useState({
    name: '', owner_id: '1', species_id: '', breed: '', 
    date_of_birth: '', gender: 'Unknown', color: '', status: 'Active'
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // Para previsualizar la foto
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const breedsBySpecies = {
    '1': ['Labrador', 'Poodle', 'Pastor Alemán', 'Golden Retriever', 'Chihuahua', 'Otro'],
    '2': ['Persa', 'Siamés', 'Bengala', 'Maine Coon', 'Angora', 'Otro'],
    '3': ['Canario', 'Perico', 'Loro', 'Cacatúa', 'Otro'],
    '4': ['Pura Sangre', 'Árabe', 'Cuarto de Milla', 'Otro'],
    '5': ['Iguana', 'Tortuga', 'Gecko', 'Otro'],
    '6': ['Hámster', 'Cuy', 'Conejo', 'Otro']
  };

  // Manejar previsualización de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await createPet(data);
      setAlert({ show: true, message: '¡Mascota registrada y sincronizada con éxito!', type: 'success' });
      // Reset completo
      setFormData({ name: '', owner_id: '1', species_id: '', breed: '', date_of_birth: '', gender: 'Unknown', color: '', status: 'Active' });
      setImage(null);
      setPreview(null);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error de conexión con el servidor.';
      setAlert({ show: true, message: msg, type: 'danger' });
    } finally {
      setLoading(false);
      // Ocultar alerta automáticamente después de 5 segundos
      setTimeout(() => setAlert({ ...alert, show: false }), 5000);
    }
  };

  return (
    <CCard className="shadow border-0 mb-4">
      <CCardHeader className="bg-dark text-white py-3 border-0">
        <div className="d-flex align-items-center">
          <span className="fs-4 me-2">📋</span>
          <h5 className="mb-0 fw-bold">Nuevo Registro de Paciente</h5>
        </div>
      </CCardHeader>
      
      <CCardBody className="p-4" style={{ backgroundColor: '#f9f9fb' }}>
        {alert.show && (
          <CAlert color={alert.type} className="border-0 shadow-sm mb-4" dismissible>
            {alert.message}
          </CAlert>
        )}
        
        <CForm onSubmit={handleSubmit}>
          {/* SECCIÓN DE FOTO */}
          <CRow className="align-items-center mb-4 pb-3 border-bottom">
            <CCol xs="auto">
              <CAvatar 
                src={preview || 'https://via.placeholder.com/100?text=S/F'} 
                size="xl" 
                className="border border-3 border-white shadow-sm" 
                style={{ width: '90px', height: '90px', objectFit: 'cover' }}
              />
            </CCol>
            <CCol>
              <CFormLabel className="fw-bold text-dark mb-1">Fotografía del Paciente</CFormLabel>
              <CFormInput 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="form-control-sm shadow-sm"
              />
              <small className="text-muted small">Formatos permitidos: JPG, PNG. Máx 2MB.</small>
            </CCol>
          </CRow>

          {/* DATOS PRINCIPALES */}
          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small text-uppercase">Nombre de la Mascota *</CFormLabel>
              <CFormInput 
                required 
                placeholder="Nombre completo"
                className="shadow-sm border-0 p-2"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </CCol>
            
            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small text-uppercase">Especie *</CFormLabel>
              <CFormSelect 
                required 
                className="shadow-sm border-0 p-2"
                value={formData.species_id} 
                onChange={e => setFormData({...formData, species_id: e.target.value, breed: ''})}
              >
                <option value="">Seleccione especie...</option>
                <option value="1">🐶 Canino</option>
                <option value="2">🐱 Felino</option>
                <option value="3">🦜 Ave</option>
                <option value="4">🐴 Equino</option>
                <option value="5">🦎 Reptil</option>
                <option value="6">🐹 Roedor</option>
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small text-uppercase">Raza *</CFormLabel>
              <CFormSelect 
                required 
                className="shadow-sm border-0 p-2"
                disabled={!formData.species_id}
                value={formData.breed} 
                onChange={e => setFormData({...formData, breed: e.target.value})}
              >
                <option value="">Seleccione raza...</option>
                {formData.species_id && breedsBySpecies[formData.species_id].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small text-uppercase">Género</CFormLabel>
              <CFormSelect 
                className="shadow-sm border-0 p-2"
                value={formData.gender} 
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Male">Macho</option>
                <option value="Female">Hembra</option>
                <option value="Unknown">Desconocido</option>
              </CFormSelect>
            </CCol>

            <CCol md={4}>
              <CFormLabel className="fw-semibold text-secondary small text-uppercase">Fecha de Nacimiento</CFormLabel>
              <CFormInput 
                type="date" 
                className="shadow-sm border-0 p-2"
                value={formData.date_of_birth} 
                onChange={e => setFormData({...formData, date_of_birth: e.target.value})} 
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel className="fw-semibold text-secondary small text-uppercase">Color Dominante</CFormLabel>
              <CFormInput 
                placeholder="Ej. Atigrado"
                className="shadow-sm border-0 p-2"
                value={formData.color} 
                onChange={e => setFormData({...formData, color: e.target.value})} 
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel className="fw-semibold text-secondary small text-uppercase">Estado Inicial</CFormLabel>
              <CFormSelect 
                className="shadow-sm border-0 p-2"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Activo</option>
                <option value="Inactive">Inactivo</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {/* BOTÓN DE ACCIÓN */}
          <div className="mt-5 pt-3">
            <CButton 
              type="submit" 
              color="primary" 
              disabled={loading} 
              className="px-5 py-2 shadow fw-bold rounded-pill float-end"
            >
              {loading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Procesando...
                </>
              ) : (
                'Finalizar Registro ✨'
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default RegisterPet;