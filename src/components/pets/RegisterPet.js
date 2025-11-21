import React, { useState } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CAlert,
  CSpinner
} from '@coreui/react';
import { cilPlus, cilCheckCircle } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/pets/RegisterPet.css';

const RegisterPet = () => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const speciesOptions = [
    { value: '', label: 'Select species' },
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de registro
    setTimeout(() => {
      setLoading(false);
      setAlert({
        show: true,
        message: 'Pet registered successfully!',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        species: '',
        breed: '',
        age: '',
        weight: '',
        color: '',
        description: ''
      });
    }, 1500);
  };

  return (
    <CCard className="register-pet-card">
      <CCardHeader>
        <h5 className="mb-0">
          <CIcon icon={cilPlus} className="me-2" />
          Register New Pet
        </h5>
      </CCardHeader>
      <CCardBody>
        {alert.show && (
          <CAlert color={alert.type} className="mb-3">
            {alert.message}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="name">Pet Name *</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter pet name"
                  required
                />
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="species">Species *</CFormLabel>
                <CFormSelect
                  id="species"
                  value={formData.species}
                  onChange={(e) => handleInputChange('species', e.target.value)}
                  required
                >
                  {speciesOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="breed">Breed</CFormLabel>
                <CFormInput
                  type="text"
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => handleInputChange('breed', e.target.value)}
                  placeholder="Enter breed"
                />
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="age">Age</CFormLabel>
                <CFormInput
                  type="text"
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="e.g., 2 years"
                />
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="weight">Weight (kg)</CFormLabel>
                <CFormInput
                  type="text"
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="e.g., 5.2"
                />
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="color">Color</CFormLabel>
                <CFormInput
                  type="text"
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="Enter color"
                />
              </div>
            </CCol>
          </CRow>

          <div className="mb-3">
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              id="description"
              rows="3"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional information about your pet..."
            />
          </div>

          <div className="text-end">
            <CButton 
              type="submit" 
              color="primary" 
              disabled={loading}
              className="register-pet-btn"
            >
              {loading ? (
                <>
                  <CSpinner size="sm" className="me-1" />
                  Registering...
                </>
              ) : (
                <>
                  <CIcon icon={cilCheckCircle} className="me-1" />
                  Register Pet
                </>
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default RegisterPet;