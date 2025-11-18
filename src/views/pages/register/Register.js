// IMPORTS
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
  CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilCalendar, cilEnvelopeClosed, cilPhone } from '@coreui/icons'
import './register.css'

const Register = () => {
  const navigate = useNavigate()

  // Estado de formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    usuario: '',
    correo: '',
    contrasena: '',
    repetirContrasena: '',
  })

  // Estado de errores
  const [errors, setErrors] = useState({})

  // Estado del botón ver/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false)

  // Expresiones regulares para validar campos
  const regex = useMemo(() => ({
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,100}$/,
    usuario: /^[A-Za-z0-9._-]{4,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^[0-9+\-\s()]{7,11}$/,
    passwordFuerte: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
  }), [])

  // Validación individual de cada campo
  const validarCampo = (name, value) => {
    switch (name) {
      case 'nombres':
        if (!value) return 'Los nombres son obligatorios.'
        if (!regex.nombre.test(value)) return 'Solo letras y espacios (2–100).'
        return ''
      case 'apellidos':
        if (!value) return 'Los apellidos son obligatorios.'
        if (!regex.nombre.test(value)) return 'Solo letras y espacios (2–100).'
        return ''
      case 'fecha_nacimiento':
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
      case 'telefono':
        if (!value) return ''
        if (!regex.telefono.test(value)) return 'Formato de teléfono inválido.'
        return ''
      case 'direccion':
        if (!value) return ''
        if (value.trim().length < 5) return 'Dirección demasiado corta.'
        return ''
      case 'usuario':
        if (!value) return 'El usuario es obligatorio.'
        if (!regex.usuario.test(value)) return '4–50 caracteres. Solo letras, números, ".", "_" y "-".'
        return ''
      case 'correo':
        if (!value) return 'El correo es obligatorio.'
        if (!regex.email.test(value)) return 'Correo inválido.'
        return ''
      case 'contrasena':
        if (!value) return 'La contraseña es obligatoria.'
        if (!regex.passwordFuerte.test(value)) return 'Mínimo 8 caracteres, incluye letras y números.'
        return ''
      case 'repetirContrasena':
        if (!value) return 'Repite la contraseña.'
        if (value !== formData.contrasena) return 'Las contraseñas no coinciden.'
        return ''
      default:
        return ''
    }
  }

  // Manejo de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value })) // permitimos espacios
    setErrors(prev => ({ ...prev, [name]: validarCampo(name, value) }))
  }

  // Validación general del formulario
  const validarFormularioCompleto = () => {
    const nuevosErrores = {}
    Object.keys(formData).forEach(campo => {
      nuevosErrores[campo] = validarCampo(campo, formData[campo])
    })
    setErrors(nuevosErrores)
    return Object.values(nuevosErrores).every(msg => msg === '')
  }

  // Enviar registro
  const handleRegister = (e) => {
    e.preventDefault()

    // Limpiar espacios al inicio y fin al enviar
    const formDataTrimmed = {}
    Object.keys(formData).forEach(key => {
      formDataTrimmed[key] = typeof formData[key] === 'string' ? formData[key].trim() : formData[key]
    })
    setFormData(formDataTrimmed)

    if (!validarFormularioCompleto()) return

    const usuarioRegistrado = {
      usuario: formDataTrimmed.usuario,
      correo: formDataTrimmed.correo,
      contrasena: formDataTrimmed.contrasena,
    }
    localStorage.setItem('usuarioRegistrado', JSON.stringify(usuarioRegistrado))

    alert('Usuario registrado correctamente ✅')
    navigate('/login', { state: { correo: formDataTrimmed.correo } })
  }

  // Render de errores
  const renderError = campo => errors[campo] ? <small className="text-danger">{errors[campo]}</small> : null

  return (
    <div className="auth-wrapper">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol lg={10} xl={9}>
            <CCard className="auth-card">

              {/* Panel izquierdo */}
              <CCardBody className="auth-card-inner">
                <CForm className="auth-form" onSubmit={handleRegister} noValidate>
                  
                  <div className="auth-header">
                    <h1>Registro</h1>
                    <p>Crea tu cuenta</p>
                  </div>

                  {/* Nombres */}
                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="nombres" placeholder="Nombres" value={formData.nombres} onChange={handleChange} />
                  </CInputGroup>
                  {renderError('nombres')}

                  {/* Apellidos */}
                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} />
                  </CInputGroup>
                  {renderError('apellidos')}

                  {/* Fecha nacimiento */}
                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    <CFormInput type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
                  </CInputGroup>
                  {renderError('fecha_nacimiento')}

                  {/* Teléfono */}
                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                    <CFormInput name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                  </CInputGroup>
                  {renderError('telefono')}

                  {/* Dirección */}
                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
                    <CFormInput name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
                  </CInputGroup>
                  {renderError('direccion')}

                  {/* Usuario */}
                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="usuario" placeholder="Usuario" value={formData.usuario} onChange={handleChange} />
                  </CInputGroup>
                  {renderError('usuario')}

                  {/* Correo */}
                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
                    <CFormInput name="correo" placeholder="Correo" value={formData.correo} onChange={handleChange} />
                  </CInputGroup>
                  {renderError('correo')}

                  {/* Contraseña */}
                  <CInputGroup className="mb-2 password-wrapper">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      name="contrasena"
                      placeholder="Contraseña"
                      value={formData.contrasena}
                      onChange={handleChange}
                    />
                    <button type="button" className="btn-ver-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </CInputGroup>
                  {renderError('contrasena')}

            	{/* Repetir contraseña */}
		<CInputGroup className="mb-3 password-wrapper">
  <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
  <CFormInput
    type={showPassword ? 'text' : 'password'}
    name="repetirContrasena"
    placeholder="Repetir contraseña"
    value={formData.repetirContrasena}
    onChange={handleChange}
  />
  <button type="button" className="btn-ver-password" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? '👁️‍🗨️' : '👁️'}
  </button>
</CInputGroup>
{renderError('repetirContrasena')}

                  <CButton type="submit" className="btn">Crear cuenta</CButton>
                </CForm>
              </CCardBody>

              {/* Panel derecho */}
              <CCardBody className="auth-card-right">
                <h2>Únete a nuestra comunidad</h2>
                <p>Regístrate para acceder a servicios exclusivos de nuestra clínica y gestionar de forma profesional y segura la información de tus clientes y pacientes.</p>
              </CCardBody>

            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register