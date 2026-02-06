import React, { useState, useRef, useEffect } from 'react';
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
  CSpinner,
  CBadge,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import { cilUser, cilCamera, cilCheckCircle, cilX, cilEnvelopeClosed, cilPhone, cilCalendar, cilAddressBook, cilLockLocked } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import '../../css/profile/ProfileModal.css';

const ProfileModal = ({ show, onClose, userData = {}, onSave, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    identification_number: '',
    phone: '',
    address: '',
    date_of_birth: '',
    role_id: 1,
    status: 'Active',
    profile_photo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  // Determinar el modo (edit = editar, create = nuevo usuario)
  const isEditMode = mode === 'edit';

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (show) {
      loadRoles();
      if (isEditMode && userData && userData.id) {
        loadUserDetails(userData.id);
      } else {
        // Si es nuevo usuario, resetear formulario
        resetForm();
      }
    }
  }, [show, isEditMode, userData]);

  const loadRoles = async () => {
    try {
      const response = await axios.get('https://vetproyectbackend.onrender.com/roles');
      if (response.data.type === "Successfully") {
        setRoles(response.data.message.roles || []);
      }
    } catch (error) {
      console.error('Error cargando roles:', error);
      setAlert({
        show: true,
        message: 'Error al cargar los roles',
        type: 'warning'
      });
    }
  };

  const loadUserDetails = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://vetproyectbackend.onrender.com/users/search/${userId}`);
      
      if (response.data.type === "Successfully") {
        const user = response.data.message.user;
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          username: user.username || '',
          email: user.email || '',
          password: '', // No cargamos la contraseña por seguridad
          confirmPassword: '',
          identification_number: user.identification_number || '',
          phone: user.phone || '',
          address: user.address || '',
          date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
          role_id: user.role_id || 1,
          status: user.status || 'Active',
          profile_photo: user.profile_photo || ''
        });
        setImagePreview(user.profile_photo || '');
      }
    } catch (error) {
      console.error('Error cargando detalles del usuario:', error);
      setAlert({
        show: true,
        message: 'Error al cargar detalles del usuario',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      identification_number: '',
      phone: '',
      address: '',
      date_of_birth: '',
      role_id: 1,
      status: 'Active',
      profile_photo: ''
    });
    setImagePreview('');
    setAlert({ show: false, message: '', type: '' });
  };

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
        // Convertir a base64 para enviar al backend
        setFormData(prev => ({ ...prev, profile_photo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, profile_photo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validación básica
    if (!formData.first_name.trim()) errors.first_name = 'El nombre es obligatorio';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es obligatorio';
    if (!formData.username.trim()) errors.username = 'El usuario es obligatorio';
    if (!formData.email.trim()) errors.email = 'El email es obligatorio';
    if (!formData.identification_number.trim()) errors.identification_number = 'La identificación es obligatoria';
    
    if (!isEditMode) {
      // Solo validar contraseña en modo creación
      if (!formData.password) errors.password = 'La contraseña es obligatoria';
      else if (formData.password.length < 8) errors.password = 'Mínimo 8 caracteres';
      else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) errors.password = 'Debe contener letras y números';
      
      if (!formData.confirmPassword) errors.confirmPassword = 'Confirma la contraseña';
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Validar email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (Object.keys(errors).length > 0) {
      setAlert({
        show: true,
        message: 'Por favor, corrige los errores en el formulario',
        type: 'danger'
      });
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlert({ show: false, message: '', type: '' });
    
    try {
      const payload = {
        ...formData,
        // Eliminar campos que no se envían en actualización
        ...(isEditMode && { 
          password: undefined,
          confirmPassword: undefined 
        })
      };

      let response;
      
      if (isEditMode && userData.id) {
        // Actualizar usuario existente
        response = await axios.post(`https://vetproyectbackend.onrender.com/users/update/${userData.id}`, payload);
      } else {
        // Crear nuevo usuario
        response = await axios.post('https://vetproyectbackend.onrender.com/users/register', payload);
      }

      const { data } = response;
      
      if (data.type === "Successfully") {
        setAlert({
          show: true,
          message: isEditMode 
            ? '✅ Usuario actualizado exitosamente' 
            : '✅ Usuario creado exitosamente',
          type: 'success'
        });
        
        // Llamar al callback onSave si existe
        if (onSave) {
          onSave(data.message.user || formData);
        }
        
        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
          onClose();
        }, 1500);
        
      } else {
        setAlert({
          show: true,
          message: '❌ ' + (data.message || 'Error en la operación'),
          type: 'danger'
        });
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
      setAlert({
        show: true,
        message: '❌ ' + (error.response?.data?.message || 'Error al guardar usuario'),
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderField = (label, field, type = 'text', icon, required = true, disabled = false) => {
    const value = formData[field] || '';
    const error = alert.show && !value && required ? `${label} es requerido` : '';
    
    return (
      <div className="mb-3">
        <CFormLabel htmlFor={field} className={`profile-form-label ${required ? 'required-field' : ''}`}>
          {icon && <CIcon icon={icon} className="me-1" />}
          {label}
        </CFormLabel>
        <CInputGroup>
          {icon && (
            <CInputGroupText>
              <CIcon icon={icon} />
            </CInputGroupText>
          )}
          {type === 'textarea' ? (
            <CFormInput
              as="textarea"
              rows="2"
              id={field}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={`Ingrese ${label.toLowerCase()}`}
              disabled={disabled || loading}
              className={error ? 'is-invalid' : ''}
            />
          ) : (
            <CFormInput
              type={type}
              id={field}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={`Ingrese ${label.toLowerCase()}`}
              disabled={disabled || loading}
              className={error ? 'is-invalid' : ''}
            />
          )}
        </CInputGroup>
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
    );
  };

  const renderPasswordField = (label, field, required = true) => {
    const value = formData[field] || '';
    const error = alert.show && !value && required ? `${label} es requerido` : '';
    
    return (
      <div className="mb-3">
        <CFormLabel htmlFor={field} className={`profile-form-label ${required ? 'required-field' : ''}`}>
          <CIcon icon={cilLockLocked} className="me-1" />
          {label}
        </CFormLabel>
        <CInputGroup>
          <CInputGroupText>
            <CIcon icon={cilLockLocked} />
          </CInputGroupText>
          <CFormInput
            type={showPassword ? 'text' : 'password'}
            id={field}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={`Ingrese ${label.toLowerCase()}`}
            disabled={loading}
            className={error ? 'is-invalid' : ''}
          />
          <CButton
            type="button"
            color="secondary"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </CButton>
        </CInputGroup>
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
    );
  };

  return (
    <CModal 
      alignment="center" 
      visible={show} 
      onClose={onClose}
      size="lg"
      backdrop="static"
      className="profile-modal"
    >
      <CModalHeader closeButton className="profile-modal-header">
        <CModalTitle>
          <CIcon icon={cilUser} className="me-2" />
          {isEditMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody className="profile-modal-body">
        {alert.show && (
          <CAlert 
            color={alert.type} 
            className="profile-alert"
            dismissible
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </CAlert>
        )}
        
        {loading && !userData.id ? (
          <div className="text-center py-4 profile-loading">
            <CSpinner color="primary" />
            <p className="mt-2">Cargando datos...</p>
          </div>
        ) : (
          <CRow>
            {/* Columna izquierda - Foto de perfil */}
            <CCol md={4} className="mb-4 mb-md-0">
              <CCard className="profile-photo-card">
                <CCardBody className="text-center">
                  <div className="profile-photo-container">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Foto de perfil" 
                        className="profile-photo-img"
                      />
                    ) : (
                      <div className="profile-photo-placeholder">
                        <CIcon icon={cilUser} size="xl" />
                      </div>
                    )}
                    
                    <div className="profile-photo-overlay">
                      <CButton 
                        color="primary" 
                        size="sm"
                        onClick={handleTriggerFileInput}
                        className="profile-photo-btn"
                        title="Cambiar foto"
                      >
                        <CIcon icon={cilCamera} />
                      </CButton>
                      
                      {imagePreview && (
                        <CButton 
                          color="danger" 
                          size="sm"
                          onClick={handleRemoveImage}
                          className="profile-photo-btn"
                          title="Eliminar foto"
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
                    className="d-none"
                  />
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      PNG, JPG, GIF hasta 5MB
                    </small>
                  </div>
                  
                  {isEditMode && userData.id && (
                    <div className="mt-2">
                      <CBadge color="secondary">
                        ID: {userData.id}
                      </CBadge>
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
            
            {/* Columna derecha - Formulario */}
            <CCol md={8}>
              <CForm className="profile-form">
                <CRow>
                  <CCol md={6}>
                    {renderField('Nombre', 'first_name', 'text', cilUser, true, loading)}
                  </CCol>
                  <CCol md={6}>
                    {renderField('Apellido', 'last_name', 'text', cilUser, true, loading)}
                  </CCol>
                </CRow>
                
                <CRow>
                  <CCol md={6}>
                    {renderField('Usuario', 'username', 'text', cilUser, true, loading)}
                  </CCol>
                  <CCol md={6}>
                    {renderField('Email', 'email', 'email', cilEnvelopeClosed, true, loading)}
                  </CCol>
                </CRow>
                
                <CRow>
                  <CCol md={6}>
                    {renderField('Identificación', 'identification_number', 'text', cilUser, true, loading)}
                  </CCol>
                  <CCol md={6}>
                    {renderField('Teléfono', 'phone', 'tel', cilPhone, false, loading)}
                  </CCol>
                </CRow>
                
                <CRow>
                  <CCol md={6}>
                    {renderField('Fecha de Nacimiento', 'date_of_birth', 'date', cilCalendar, false, loading)}
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="role_id" className="profile-form-label required-field">
                        <CIcon icon={cilUser} className="me-1" />
                        Rol
                      </CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormSelect
                          id="role_id"
                          value={formData.role_id}
                          onChange={(e) => handleInputChange('role_id', parseInt(e.target.value))}
                          disabled={loading}
                        >
                          <option value="">Seleccionar rol</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </CFormSelect>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                
                {!isEditMode && (
                  <CRow>
                    <CCol md={6}>
                      {renderPasswordField('Contraseña', 'password', true)}
                    </CCol>
                    <CCol md={6}>
                      {renderPasswordField('Confirmar Contraseña', 'confirmPassword', true)}
                    </CCol>
                  </CRow>
                )}
                
                {renderField('Dirección', 'address', 'textarea', cilAddressBook, false, loading)}
                
                {isEditMode && (
                  <div className="mb-3">
                    <CFormLabel htmlFor="status" className="profile-form-label">
                      Estado
                    </CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        disabled={loading}
                      >
                        <option value="Active">Activo</option>
                        <option value="Inactive">Inactivo</option>
                        <option value="Suspended">Suspendido</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>
                )}
              </CForm>
            </CCol>
          </CRow>
        )}
      </CModalBody>
      
      <CModalFooter className="profile-modal-footer">
        <CButton 
          color="secondary" 
          onClick={onClose}
          disabled={loading}
          className="profile-btn-cancel"
        >
          <CIcon icon={cilX} className="me-1" />
          Cancelar
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleSave}
          disabled={loading}
          className="profile-btn-save"
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-1" />
              {isEditMode ? 'Guardando...' : 'Registrando...'}
            </>
          ) : (
            <>
              <CIcon icon={cilCheckCircle} className="me-1" />
              {isEditMode ? 'Guardar Cambios' : 'Registrar Usuario'}
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ProfileModal;