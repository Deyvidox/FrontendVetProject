import React, { useState, useRef } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CAlert,
  CSpinner
} from '@coreui/react';
import { cilUser, cilCamera, cilCheckCircle, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const ProfileModal = ({ show, onClose, userData = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    bio: '',
    ...userData
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState(userData?.avatar || '');
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setLoading(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      setAlert({
        show: true,
        message: 'Perfil actualizado correctamente',
        type: 'success'
      });
    }, 1500);
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <CModal 
      alignment="center" 
      visible={show} 
      onClose={onClose}
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilUser} className="me-2" />
          Editar Perfil
        </CModalTitle>
        <CButton color="transparent" size="sm" onClick={onClose}>
          <CIcon icon={cilX} />
        </CButton>
      </CModalHeader>
      
      <CModalBody>
        {alert.show && (
          <CAlert color={alert.type} className="mb-3">
            {alert.message}
          </CAlert>
        )}
        
        <CRow>
          <CCol md={4} className="text-center">
            <CCard className="mb-3">
              <CCardBody>
                <div style={{ 
                  position: 'relative', 
                  width: '140px', 
                  height: '140px', 
                  margin: '0 auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #321fdb 0%, #1f1498 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <CIcon icon={cilUser} size="xl" />
                    </div>
                  )}
                  
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '0.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    opacity: '0',
                    transition: 'opacity 0.3s ease'
                  }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} 
                     onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                    <CButton 
                      color="primary" 
                      size="sm"
                      onClick={handleTriggerFileInput}
                      style={{ padding: '0.375rem', borderRadius: '50%', width: '32px', height: '32px' }}
                    >
                      <CIcon icon={cilCamera} />
                    </CButton>
                    
                    {imagePreview && (
                      <CButton 
                        color="danger" 
                        size="sm"
                        onClick={handleRemoveImage}
                        style={{ padding: '0.375rem', borderRadius: '50%', width: '32px', height: '32px', marginLeft: '0.25rem' }}
                      >
                        <CIcon icon={cilX} />
                      </CButton>
                    )}
                  </div>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <div className="mt-2">
                  <small className="text-muted">
                    PNG, JPG hasta 5MB
                  </small>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          
          <CCol md={8}>
            <CForm>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="name">
                      Nombre Completo
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                </CCol>
                
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="email">
                      Correo Electrónico
                    </CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu.email@ejemplo.com"
                    />
                  </div>
                </CCol>
              </CRow>
              
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="phone">
                      Teléfono
                    </CFormLabel>
                    <CFormInput
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </CCol>
                
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="role">
                      Rol
                    </CFormLabel>
                    <CFormSelect
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                    >
                      <option value="admin">Administrador</option>
                      <option value="user">Usuario</option>
                      <option value="editor">Editor</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
              
              <div className="mb-3">
                <CFormLabel htmlFor="bio">
                  Biografía
                </CFormLabel>
                <CFormInput
                  as="textarea"
                  rows="3"
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Describe tu experiencia..."
                />
              </div>
            </CForm>
          </CCol>
        </CRow>
      </CModalBody>
      
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={onClose}
          disabled={loading}
        >
          <CIcon icon={cilX} className="me-1" />
          Cancelar
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-1" />
              Guardando...
            </>
          ) : (
            <>
              <CIcon icon={cilCheckCircle} className="me-1" />
              Guardar Cambios
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProfileModal;