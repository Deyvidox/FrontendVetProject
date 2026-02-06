import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilCalendar, cilEnvelopeClosed, cilPhone, cilAddressBook } from '@coreui/icons'
import '../../css/register/Register.css'
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    address: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    identification_number: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [modalType, setModalType] = useState('') // 'success', 'error', 'warning'

  const regex = useMemo(() => ({
    name: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,100}$/,
    username: /^[A-Za-z0-9._-]{4,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9+\-\s()]{7,20}$/,
    passwordStrong: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
    identification: /^[VEJvej0-9\-]{5,20}$/
  }), [])

  const validarCampo = (name, value) => {
    switch (name) {
      case 'first_name':
        if (!value) return 'El nombre es obligatorio.'
        if (!regex.name.test(value)) return 'Solo letras y espacios (2–100).'
        return ''

      case 'last_name':
        if (!value) return 'El apellido es obligatorio.'
        if (!regex.name.test(value)) return 'Solo letras y espacios (2–100).'
        return ''

      case 'identification_number':
        if (!value) return ''
        if (!regex.identification.test(value)) return 'Formato de identificación inválido.'
        return ''

      case 'date_of_birth':
        if (!value) return 'La fecha de nacimiento es obligatoria.'
        const fecha = new Date(value)
        const hoy = new Date()
        if (isNaN(fecha.getTime())) return 'Fecha inválida.'
        const edad = hoy.getFullYear() - fecha.getFullYear()
        const mes = hoy.getMonth() - fecha.getMonth()
        const dia = hoy.getDate() - fecha.getDate()
        const edadReal = mes < 0 || (mes === 0 && dia < 0) ? edad - 1 : edad
        if (edadReal < 18) return 'Debes ser mayor de 18 años.'
        if (edadReal > 90) return 'La edad no puede superar los 90 años.'
        return ''

      case 'phone':
        if (!value) return ''
        if (!regex.phone.test(value)) return 'Formato de teléfono inválido.'
        return ''

      case 'address':
        if (!value) return ''
        if (value.trim().length < 5) return 'Dirección demasiado corta (mínimo 5 caracteres).'
        if (value.trim().length > 500) return 'Dirección demasiado larga (máximo 500 caracteres).'
        return ''

      case 'username':
        if (!value) return 'El usuario es obligatorio.'
        if (!regex.username.test(value)) return '4–50 caracteres. Letras, números ".", "_", "-".'
        return ''

      case 'email':
        if (!value) return 'El correo es obligatorio.'
        if (!regex.email.test(value)) return 'Correo inválido.'
        return ''

      case 'password':
        if (!value) return 'La contraseña es obligatoria.'
        if (!regex.passwordStrong.test(value)) return 'Mínimo 8 caracteres, al menos una letra y un número.'
        return ''

      case 'confirmPassword':
        if (!value) return 'Confirma la contraseña.'
        if (value !== formData.password) return 'Las contraseñas no coinciden.'
        return ''

      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: validarCampo(name, value) }))
  }

  const validarFormularioCompleto = () => {
    const nuevosErrores = {}
    const camposObligatorios = ['first_name', 'last_name', 'date_of_birth', 'username', 'email', 'password', 'confirmPassword']
    
    camposObligatorios.forEach(campo => {
      nuevosErrores[campo] = validarCampo(campo, formData[campo])
    })
    
    // Validar campos opcionales si tienen valor
    ['identification_number', 'phone', 'address'].forEach(campo => {
      if (formData[campo]) {
        nuevosErrores[campo] = validarCampo(campo, formData[campo])
      }
    })
    
    setErrors(nuevosErrores)
    return Object.values(nuevosErrores).every(msg => !msg || msg === '')
  }

  const showModal = (title, message, type = 'info') => {
    setModalTitle(title)
    setModalMessage(message)
    setModalType(type)
    setModal(true)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!validarFormularioCompleto()) {
      setLoading(false)
      showModal('Error de validación', 'Por favor, corrige los errores en el formulario.', 'error')
      return
    }

    try {
      const response = await axios.post("https://vetproyectbackend.onrender.com./register", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        identification_number: formData.identification_number || null,
        date_of_birth: formData.date_of_birth,
        phone: formData.phone || null,
        address: formData.address || null,
        username: formData.username,
        email: formData.email,
        password: formData.password
      })

      const { data } = response
      
      if (data.type === "Successfully") {
        showModal('¡Registro exitoso!', data.message.text, 'success')
        
        // Limpiar formulario después de registro exitoso
        setFormData({
          first_name: '',
          last_name: '',
          date_of_birth: '',
          phone: '',
          address: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          identification_number: ''
        })
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              username: formData.username,
              email: formData.email 
            } 
          })
        }, 2000)
        
      } else {
        showModal(data.type, data.message, 'error')
      }

    } catch (error) {
      console.error('Error en registro:', error)
      
      let errorMessage = 'Error al registrar usuario'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.type === "Conflict") {
        errorMessage = error.response.data.message
      }
      
      showModal('Error', errorMessage, 'error')
      
    } finally {
      setLoading(false)
    }
  }

  const renderError = campo =>
    errors[campo] ? <small className="text-danger d-block mt-1">{errors[campo]}</small> : null

  return (
    <>
      <CModal 
        visible={modal} 
        onClose={() => setModal(false)}
        color={modalType === 'success' ? 'success' : modalType === 'error' ? 'danger' : 'primary'}
      >
        <CModalHeader>{modalTitle}</CModalHeader>
        <CModalBody>{modalMessage}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setModal(false)}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>

      <div className="auth-wrapper">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol lg={10} xl={9}>
              <CCard className="auth-card">

                <CCardBody className="auth-card-inner">
                  <CForm className="auth-form" onSubmit={handleRegister} noValidate>

                    <div className="auth-header">
                      <h1>Registro de Cliente</h1>
                      <p>Crea tu cuenta para acceder a nuestros servicios</p>
                    </div>

                    <CRow>
                      <CCol md={6}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                          <CFormInput 
                            name="first_name" 
                            placeholder="Nombre(s)"
                            value={formData.first_name} 
                            onChange={handleChange} 
                            disabled={loading}
                          />
                        </CInputGroup>
                        {renderError('first_name')}
                      </CCol>

                      <CCol md={6}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                          <CFormInput 
                            name="last_name" 
                            placeholder="Apellido(s)"
                            value={formData.last_name} 
                            onChange={handleChange} 
                            disabled={loading}
                          />
                        </CInputGroup>
                        {renderError('last_name')}
                      </CCol>
                    </CRow>

                    <CInputGroup className="mb-3">
                      <CInputGroupText><CIcon icon={cilAddressBook} /></CInputGroupText>
                      <CFormInput 
                        name="identification_number" 
                        placeholder="Número de identificación (opcional)"
                        value={formData.identification_number} 
                        onChange={handleChange} 
                        disabled={loading}
                      />
                    </CInputGroup>
                    {renderError('identification_number')}

                    <CInputGroup className="mb-3">
                      <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                      <CFormInput 
                        type="date" 
                        name="date_of_birth"
                        value={formData.date_of_birth} 
                        onChange={handleChange} 
                        disabled={loading}
                      />
                    </CInputGroup>
                    {renderError('date_of_birth')}

                    <CInputGroup className="mb-3">
                      <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                      <CFormInput 
                        name="phone" 
                        placeholder="Teléfono (opcional)"
                        value={formData.phone} 
                        onChange={handleChange} 
                        disabled={loading}
                      />
                    </CInputGroup>
                    {renderError('phone')}

                    <CInputGroup className="mb-3">
                      <CInputGroupText><CIcon icon={cilAddressBook} /></CInputGroupText>
                      <CFormInput 
                        name="address" 
                        placeholder="Dirección (opcional)"
                        value={formData.address} 
                        onChange={handleChange} 
                        disabled={loading}
                      />
                    </CInputGroup>
                    {renderError('address')}

                    <CInputGroup className="mb-3">
                      <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                      <CFormInput 
                        name="username" 
                        placeholder="Nombre de usuario"
                        value={formData.username} 
                        onChange={handleChange} 
                        disabled={loading}
                      />
                    </CInputGroup>
                    {renderError('username')}

                    <CInputGroup className="mb-3">
                      <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
                      <CFormInput 
                        name="email" 
                        type="email"
                        placeholder="Correo electrónico"
                        value={formData.email} 
                        onChange={handleChange} 
                        disabled={loading}
                      />
                    </CInputGroup>
                    {renderError('email')}

                    <CInputGroup className="mb-3 password-wrapper">
                      <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button 
                        type="button" 
                        className="btn-ver-password"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? '👁️‍🗨️' : '👁️'}
                      </button>
                    </CInputGroup>
                    {renderError('password')}

                    <CInputGroup className="mb-4 password-wrapper">
                      <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirmar contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button 
                        type="button" 
                        className="btn-ver-password"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? '👁️‍🗨️' : '👁️'}
                      </button>
                    </CInputGroup>
                    {renderError('confirmPassword')}

                    <CButton 
                      type="submit" 
                      color="primary" 
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? "Registrando..." : "Crear cuenta"}
                    </CButton>

                    <div className="text-center mt-3">
                      <p className="mb-0">
                        ¿Ya tienes una cuenta?{' '}
                        <CButton 
                          color="link" 
                          onClick={() => navigate('/login')}
                          disabled={loading}
                        >
                          Inicia sesión aquí
                        </CButton>
                      </p>
                    </div>
                  </CForm>
                </CCardBody>

                <CCardBody className="auth-card-right">
                  <h2>Únete a nuestra comunidad</h2>
                  <p>
                    Regístrate para acceder a servicios exclusivos de nuestra clínica veterinaria.
                    Como cliente podrás:
                  </p>
                  <ul className="list-unstyled">
                    <li>✓ Registrar y gestionar tus mascotas</li>
                    <li>✓ Agendar citas en línea</li>
                    <li>✓ Ver historial de consultas</li>
                    <li>✓ Recibir recordatorios de vacunación</li>
                    <li>✓ Acceder a promociones especiales</li>
                  </ul>
                  <p className="mt-3">
                    <small>* Todos los campos obligatorios están marcados con validación en tiempo real.</small>
                  </p>
                </CCardBody>

              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Register