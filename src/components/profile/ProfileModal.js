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

const ProfileModal = ({ show, onClose, userData, onUpdate }) => {
  const [formData, setFormData] = useState(userData || {});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(userData?.avatar || '');
  const fileInputRef = useRef(null);

  // Datos por defecto
  const defaultUserData = {
    id: 1,
    name: 'david',
    email: 'david@gmail.com',
    phone: '+58424-5678900',
    role: 'admin',
    department: '...',
    position: '....',
    location: 'tachira',
    bio: '...',
    avatar: '',
    joinDate: '2024-01-01',
    status: 'active'
  };

  const currentUser = { ...defaultUserData, ...userData };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showAlert('Por favor selecciona una imagen válida', 'danger');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showAlert('La imagen debe ser menor a 5MB', 'danger');
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedData = {
        ...formData,
        avatar: imagePreview || currentUser.avatar
      };
      
      if (onUpdate) {
        onUpdate(updatedData);
      }
      
      showAlert('Perfil actualizado correctamente', 'success');
      
      setTimeout(() => {
        onClose();
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      showAlert('Error al actualizar el perfil', 'danger');
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
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
                      Nombre Completo *
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      value={formData.name || currentUser.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                </CCol>
                
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="email">
                      Correo Electrónico *
                    </CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      value={formData.email || currentUser.email}
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
                      value={formData.phone || currentUser.phone}
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
                      value={formData.role || currentUser.role}
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
                  value={formData.bio || currentUser.bio}
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