import React, { useState, useEffect } from 'react';
import { 
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, 
  CButton, CForm, CFormInput, CFormLabel, CFormSelect, CRow, CCol, CAvatar
} from '@coreui/react';
import { updatePet } from './PetService';

const EditPetModal = ({ visible, setVisible, pet, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '', breed: '', color: '', status: '', gender: '', species_id: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const breedsBySpecies = {
    '1': ['Labrador', 'Poodle', 'Pastor Alemán', 'Golden Retriever', 'Chihuahua', 'Otro'],
    '2': ['Persa', 'Siamés', 'Bengala', 'Maine Coon', 'Angora', 'Otro'],
    '3': ['Canario', 'Perico', 'Loro', 'Cacatúa', 'Otro'],
    '4': ['Pura Sangre', 'Árabe', 'Cuarto de Milla', 'Otro'],
    '5': ['Iguana', 'Tortuga', 'Gecko', 'Otro'],
    '6': ['Hámster', 'Cuy', 'Conejo', 'Otro']
  };

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        breed: pet.breed || '',
        color: pet.color || '',
        status: pet.status || 'Active',
        gender: pet.gender || 'Unknown',
        species_id: String(pet.species_id) || ''
      });
      setPreview(pet.image_url); // Cargar imagen actual
    }
  }, [pet]);

  // Manejar previsualización de imagen nueva
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file)); // Mostrar la nueva imagen seleccionada
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    const data = new FormData();
    
    data.append('name', formData.name);
    data.append('breed', formData.breed);
    data.append('color', formData.color);
    data.append('status', formData.status);
    data.append('gender', formData.gender);
    data.append('species_id', parseInt(formData.species_id));
    data.append('owner_id', pet.owner_id); 

    if (newImage) {
      data.append('image', newImage); 
    }

    try {
      await updatePet(pet.id, data);
      onUpdate(); 
      setVisible(false);
      setNewImage(null);
    } catch (err) {
      console.error("Error:", err.response?.data);
      alert("Error: " + (err.response?.data?.message || "Error al actualizar"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static" size="lg" className="border-0 shadow-lg">
      <CModalHeader className="bg-dark text-white border-0">
        <CModalTitle className="fw-bold">
          🐾 Editar Expediente: <span className="text-info">{pet?.name}</span>
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-4" style={{ backgroundColor: '#f9f9fb' }}>
        <CForm>
          <CRow className="align-items-center mb-4">
            <CCol xs="auto">
              <CAvatar 
                src={preview || 'https://via.placeholder.com/100'} 
                size="xl" 
                className="border border-3 border-white shadow" 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </CCol>
            <CCol>
              <h5 className="mb-0 fw-bold text-dark">Foto del Paciente</h5>
              <p className="text-muted small">ID Registro: #00{pet?.id}</p>
            </CCol>
          </CRow>

          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small uppercase">Nombre</CFormLabel>
              <CFormInput 
                className="shadow-sm border-0 p-2"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small uppercase">Especie</CFormLabel>
              <CFormSelect 
                className="shadow-sm border-0 p-2"
                value={formData.species_id} 
                onChange={e => setFormData({...formData, species_id: e.target.value, breed: ''})}
              >
                <option value="1">Canino</option>
                <option value="2">Felino</option>
                <option value="3">Ave</option>
                <option value="4">Equino</option>
                <option value="5">Reptil</option>
                <option value="6">Roedor</option>
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small uppercase">Raza</CFormLabel>
              <CFormSelect 
                className="shadow-sm border-0 p-2"
                value={formData.breed} 
                onChange={e => setFormData({...formData, breed: e.target.value})}
              >
                <option value="">Seleccione raza...</option>
                {formData.species_id && breedsBySpecies[formData.species_id]?.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small uppercase">Género</CFormLabel>
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

            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small uppercase">Color</CFormLabel>
              <CFormInput 
                className="shadow-sm border-0 p-2"
                value={formData.color} 
                onChange={e => setFormData({...formData, color: e.target.value})} 
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel className="fw-semibold text-secondary small uppercase">Estado Clínico</CFormLabel>
              <CFormSelect 
                className="shadow-sm border-0 p-2"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">🟢 Activo</option>
                <option value="Inactive">🟡 Inactivo</option>
                <option value="Deceased">⚫ Fallecido</option>
              </CFormSelect>
            </CCol>

            <CCol md={12} className="mt-4">
              <div className="bg-white p-3 rounded shadow-sm border border-light">
                <CFormLabel className="fw-bold mb-2">📸 Cambiar Foto</CFormLabel>
                <CFormInput 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control-sm"
                />
              </div>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>

      <CModalFooter className="bg-light border-0">
        <CButton color="link" className="text-decoration-none text-muted" onClick={() => setVisible(false)}>
          Descartar
        </CButton>
        <CButton 
          color="primary" 
          className="px-5 py-2 shadow fw-bold rounded-pill" 
          onClick={handleSave} 
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : 'Guardar Cambios'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditPetModal;