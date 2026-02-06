import React, { useState, useEffect } from 'react'
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
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner
} from '@coreui/react'
import { 
  cilUser, 
  cilSave, 
  cilX, 
  cilEnvelopeClosed, 
  cilPhone, 
  cilCalendar, 
  cilAddressBook,
  cilLockLocked
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

const UserRegister = ({ show, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const [roles, setRoles] = useState([])
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
    profile_photo: ''
  })

  const [errors, setErrors] = useState({})

  // Cargar roles al abrir el modal
  useEffect(() => {
    if (show) {
      loadRoles()
      resetForm()
    }
  }, [show])

  const loadRoles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/roles')
      if (response.data.type === "Successfully") {
        setRoles(response.data.message.roles || [])
      }
    } catch (error) {
      console.error('Error cargando roles:', error)
    }
  }

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
      profile_photo: ''
    })
    setErrors({})
    setAlert({ show: false, message: '', type: '' })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Validar en tiempo real
    validateField(field, value)
  }

  const validateField = (field, value) => {
    let error = ''
    
    switch (field) {
      case 'first_name':
        if (!value.trim()) error = 'El nombre es obligatorio'
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) error = 'Solo letras y espacios'
        break
        
      case 'last_name':
        if (!value.trim()) error = 'El apellido es obligatorio'
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) error = 'Solo letras y espacios'
        break
        
      case 'username':
        if (!value.trim()) error = 'El usuario es obligatorio'
        else if (!/^[A-Za-z0-9._-]+$/.test(value)) error = 'Solo letras, números, puntos, guiones y guiones bajos'
        else if (value.length < 4) error = 'Mínimo 4 caracteres'
        break
        
      case 'email':
        if (!value.trim()) error = 'El email es obligatorio'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email inválido'
        break
        
      case 'password':
        if (!value.trim()) error = 'La contraseña es obligatoria'
        else if (value.length < 8) error = 'Mínimo 8 caracteres'
        else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(value)) error = 'Debe contener letras y números'
        break
        
      case 'confirmPassword':
        if (!value.trim()) error = 'Confirma la contraseña'
        else if (value !== formData.password) error = 'Las contraseñas no coinciden'
        break
        
      case 'identification_number':
        if (!value.trim()) error = 'La identificación es obligatoria'
        else if (!/^[VEJvej0-9\-\s]+$/.test(value)) error = 'Formato inválido'
        break
        
      case 'phone':
        if (value.trim() && !/^[0-9+\-\s()]+$/.test(value)) error = 'Formato de teléfono inválido'
        break
        
      case 'date_of_birth':
        if (value) {
          const fecha = new Date(value)
          const hoy = new Date()
          if (fecha > hoy) error = 'La fecha no puede ser futura'
        }
        break
    }
    
    setErrors(prev => ({ ...prev, [field]: error }))
    return !error
  }

  const validateForm = () => {
    const requiredFields = [
      'first_name', 'last_name', 'username', 'email', 
      'password', 'confirmPassword', 'identification_number'
    ]
    
    let isValid = true
    const newErrors = {}
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field])
      if (!error) {
        newErrors[field] = errors[field] || ''
        if (!errors[field]) {
          // Si no hay error en el estado, validar ahora
          const fieldError = validateField(field, formData[field])
          if (!fieldError) {
            newErrors[field] = 'Campo inválido'
            isValid = false
          }
        } else {
          isValid = false
        }
      }
    })
    
    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setAlert({
        show: true,
        message: 'Por favor, corrige los errores en el formulario',
        type: 'danger'
      })
      return
    }
    
    setLoading(true)
    
    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        identification_number: formData.identification_number.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        role_id: parseInt(formData.role_id),
        profile_photo: formData.profile_photo || null
      }
      
      // Si hay onSubmit callback, usarlo
      if (onSubmit) {
        await onSubmit(payload)
        setAlert({
          show: true,
          message: 'Usuario registrado exitosamente',
          type: 'success'
        })
        
        // Cerrar después de 2 segundos
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        // O enviar directamente al backend
        const response = await axios.post('http://localhost:4000/users/register', payload)
        
        if (response.data.type === "Successfully") {
          setAlert({
            show: true,
            message: 'Usuario registrado exitosamente',
            type: 'success'
          })
          
          setTimeout(() => {
            onClose()
          }, 2000)
        } else {
          throw new Error(response.data.message || 'Error al registrar')
        }
      }
      
    } catch (error) {
      console.error('Error registrando usuario:', error)
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Error al registrar usuario',
        type: 'danger'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const renderError = (field) => {
    if (!errors[field]) return null
    
    return (
      <small className="text-danger">
        {errors[field]}
      </small>
    )
  }

  return (
    <CModal 
      alignment="center" 
      visible={show} 
      onClose={handleClose}
      size="lg"
      backdrop="static"
    >
      <CModalHeader closeButton>
        <CModalTitle>
          <CIcon icon={cilUser} className="me-2" />
          Registrar Nuevo Usuario
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {alert.show && (
          <CAlert color={alert.type} className="mb-3">
            {alert.message}
          </CAlert>
        )}
        
        <CForm onSubmit={handleSubmit}>
          {/* Información Personal */}
          <div className="form-section mb-4">
            <h6 className="section-title mb-3">
              <CIcon icon={cilUser} className="me-2" />
              Información Personal
            </h6>
            
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="first_name" className="required-field">
                    Nombre
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Ej: Juan"
                      disabled={loading}
                      invalid={!!errors.first_name}
                    />
                  </CInputGroup>
                  {renderError('first_name')}
                </div>
              </CCol>
              
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="last_name" className="required-field">
                    Apellido
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Ej: Pérez"
                      disabled={loading}
                      invalid={!!errors.last_name}
                    />
                  </CInputGroup>
                  {renderError('last_name')}
                </div>
              </CCol>
            </CRow>
            
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="identification_number" className="required-field">
                    <CIcon icon={cilUser} className="me-1" />
                    Identificación
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="identification_number"
                      value={formData.identification_number}
                      onChange={(e) => handleInputChange('identification_number', e.target.value)}
                      placeholder="Ej: V-12345678"
                      disabled={loading}
                      invalid={!!errors.identification_number}
                    />
                  </CInputGroup>
                  {renderError('identification_number')}
                </div>
              </CCol>
              
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="date_of_birth">
                    <CIcon icon={cilCalendar} className="me-1" />
                    Fecha de Nacimiento
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      id="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      disabled={loading}
                    />
                  </CInputGroup>
                </div>
              </CCol>
            </CRow>
          </div>

          {/* Información de Contacto */}
          <div className="form-section mb-4">
            <h6 className="section-title mb-3">
              <CIcon icon={cilAddressBook} className="me-2" />
              Información de Contacto
            </h6>
            
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="phone">
                    <CIcon icon={cilPhone} className="me-1" />
                    Teléfono
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Ej: +58 424 1234567"
                      disabled={loading}
                      invalid={!!errors.phone}
                    />
                  </CInputGroup>
                  {renderError('phone')}
                </div>
              </CCol>
              
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="email" className="required-field">
                    <CIcon icon={cilEnvelopeClosed} className="me-1" />
                    Email
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="ejemplo@email.com"
                      disabled={loading}
                      invalid={!!errors.email}
                    />
                  </CInputGroup>
                  {renderError('email')}
                </div>
              </CCol>
            </CRow>
            
            <div className="mb-3">
              <CFormLabel htmlFor="address">
                <CIcon icon={cilAddressBook} className="me-1" />
                Dirección
              </CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilAddressBook} />
                </CInputGroupText>
                <CFormInput
                  as="textarea"
                  rows="2"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Dirección completa"
                  disabled={loading}
                />
              </CInputGroup>
            </div>
          </div>

          {/* Credenciales de Acceso */}
          <div className="form-section mb-4">
            <h6 className="section-title mb-3">
              <CIcon icon={cilLockLocked} className="me-2" />
              Credenciales de Acceso
            </h6>
            
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="username" className="required-field">
                    Nombre de Usuario
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Ej: juanperez"
                      disabled={loading}
                      invalid={!!errors.username}
                    />
                  </CInputGroup>
                  {renderError('username')}
                </div>
              </CCol>
              
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="role_id" className="required-field">
                    Rol
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormSelect
                      id="role_id"
                      value={formData.role_id}
                      onChange={(e) => handleInputChange('role_id', e.target.value)}
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
            
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="password" className="required-field">
                    Contraseña
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      disabled={loading}
                      invalid={!!errors.password}
                    />
                  </CInputGroup>
                  {renderError('password')}
                </div>
              </CCol>
              
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="confirmPassword" className="required-field">
                    Confirmar Contraseña
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Repite la contraseña"
                      disabled={loading}
                      invalid={!!errors.confirmPassword}
                    />
                  </CInputGroup>
                  {renderError('confirmPassword')}
                </div>
              </CCol>
            </CRow>
          </div>
        </CForm>
      </CModalBody>
      
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={handleClose}
          disabled={loading}
        >
          <CIcon icon={cilX} className="me-1" />
          Cancelar
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-1" />
              Registrando...
            </>
          ) : (
            <>
              <CIcon icon={cilSave} className="me-1" />
              Registrar Usuario
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default UserRegister