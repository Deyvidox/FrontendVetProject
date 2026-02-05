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
import '../../css/register/Register.css'

const Register = () => {
  const navigate = useNavigate()

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

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const regex = useMemo(() => ({
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,100}$/,
    usuario: /^[A-Za-z0-9._-]{4,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^[0-9+\-\s()]{7,11}$/,
    passwordFuerte: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
  }), [])

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
        if (!regex.usuario.test(value)) return '4–50 caracteres. Letras, números ".", "_", "-".'
        return ''

      case 'correo':
        if (!value) return 'El correo es obligatorio.'
        if (!regex.email.test(value)) return 'Correo inválido.'
        return ''

      case 'contrasena':
        if (!value) return 'La contraseña es obligatoria.'
        if (!regex.passwordFuerte.test(value)) return 'Mínimo 8 caracteres, letras y números.'
        return ''

      case 'repetirContrasena':
        if (!value) return 'Repite la contraseña.'
        if (value !== formData.contrasena) return 'Las contraseñas no coinciden.'
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
    Object.keys(formData).forEach(campo => {
      nuevosErrores[campo] = validarCampo(campo, formData[campo])
    })
    setErrors(nuevosErrores)
    return Object.values(nuevosErrores).every(msg => msg === '')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!validarFormularioCompleto()) {
      setLoading(false)
      return
    }

    const payload = {
      nombre: `${formData.nombres} ${formData.apellidos}`,
      correo: formData.correo,
      usuario: formData.usuario,
      telefono: formData.telefono,
      fecha_nacimiento: formData.fecha_nacimiento,
      direccion: formData.direccion,
      contrasena: formData.contrasena
    }

    try {
      // Aquí irá la conexión a tu backend
      // Ejemplo: await fetch('tu-backend-url/api/auth/register', {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload)
      // });

      alert("Registro exitoso. Ahora puedes iniciar sesión.")

      navigate('/login', { state: { usuario: formData.usuario, correo: formData.correo } })

    } catch (error) {
      alert("Error al registrarse.")
    } finally {
      setLoading(false)
    }
  }

  const renderError = campo =>
    errors[campo] ? <small className="text-danger">{errors[campo]}</small> : null

  return (
    <div className="auth-wrapper">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol lg={10} xl={9}>
            <CCard className="auth-card">

              <CCardBody className="auth-card-inner">
                <CForm className="auth-form" onSubmit={handleRegister} noValidate>

                  <div className="auth-header">
                    <h1>Registro</h1>
                    <p>Crea tu cuenta</p>
                  </div>

                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="nombres" placeholder="Nombres"
                      value={formData.nombres} onChange={handleChange} disabled={loading} />
                  </CInputGroup>
                  {renderError('nombres')}

                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="apellidos" placeholder="Apellidos"
                      value={formData.apellidos} onChange={handleChange} disabled={loading} />
                  </CInputGroup>
                  {renderError('apellidos')}

                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    <CFormInput type="date" name="fecha_nacimiento"
                      value={formData.fecha_nacimiento} onChange={handleChange} disabled={loading} />
                  </CInputGroup>
                  {renderError('fecha_nacimiento')}

                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                    <CFormInput name="telefono" placeholder="Teléfono"
                      value={formData.telefono} onChange={handleChange} disabled={loading} />
                  </CInputGroup>
                  {renderError('telefono')}

                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
                    <CFormInput name="direccion" placeholder="Dirección"
                      value={formData.direccion} onChange={handleChange} disabled={loading} />
                  </CInputGroup>
                  {renderError('direccion')}

                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="usuario" placeholder="Usuario"
                      value={formData.usuario} onChange={handleChange} disabled={loading} />
                  </CInputGroup>
                  {renderError('usuario')}

                  <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
                    <CFormInput name="correo" placeholder="Correo"
                      value={formData.correo} onChange={handleChange} disabled={loading} />
                  </CInputGroup>
                  {renderError('correo')}

                  <CInputGroup className="mb-2 password-wrapper">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      name="contrasena"
                      placeholder="Contraseña"
                      value={formData.contrasena}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button type="button" className="btn-ver-password"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </CInputGroup>
                  {renderError('contrasena')}

                  <CInputGroup className="mb-3 password-wrapper">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      name="repetirContrasena"
                      placeholder="Repetir contraseña"
                      value={formData.repetirContrasena}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button type="button" className="btn-ver-password"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </CInputGroup>
                  {renderError('repetirContrasena')}

                  <CButton type="submit" className="btn" disabled={loading}>
                    {loading ? "Registrando..." : "Crear cuenta"}
                  </CButton>
                </CForm>
              </CCardBody>

              <CCardBody className="auth-card-right">
                <h2>Únete a nuestra comunidad</h2>
                <p>
                  Regístrate para acceder a servicios exclusivos de nuestra clínica y gestionar
                  de forma profesional y segura la información de tus clientes y pacientes.
                </p>
              </CCardBody>

            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register