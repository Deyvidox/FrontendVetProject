// ===============================================
// 🧩 Componente de Login
// Aquí manejo el acceso del usuario, verifico si
// coincide con los datos guardados en LocalStorage
// y muestro mensajes de error si no coincide.
// ===============================================

import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

// Importo los estilos personalizados del login
import '../../css/login/Login.css'

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Si el usuario viene del registro, recupero sus datos
  const dataFromRegister = location.state || {}

  // Estado del usuario
  const [usuario, setUsuario] = useState(dataFromRegister.usuario || dataFromRegister.correo || '')

  // Estado de contraseña
  const [password, setPassword] = useState('')

  // Estado para mostrar / ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false)

  // Estado para mostrar mensajes de error
  const [error, setError] = useState('')

  // ===========================
  // 🔐 Manejar proceso de Login
  // ===========================
  const handleLogin = (e) => {
    e.preventDefault()

    // Recupero el usuario guardado en el registro
    const usuarioRegistrado = JSON.parse(localStorage.getItem('usuarioRegistrado'))

    if (!usuarioRegistrado) {
      setError('No hay usuarios registrados. Por favor regístrate.')
      return
    }

    // Validación del login
    const accesoCorrecto =
      (usuario === usuarioRegistrado.usuario || usuario === usuarioRegistrado.correo) &&
      password === usuarioRegistrado.contrasena

    if (accesoCorrecto) {
      alert(`Bienvenido, ${usuarioRegistrado.usuario} ✅`)
      setError('')
      navigate('/dashboard')
    } else {
      setError('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <div className="auth-wrapper">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="auth-card">

              {/* Panel izquierdo con el formulario de acceso */}
              <CCardBody className="auth-card-inner">
                <CForm className="auth-form" onSubmit={handleLogin}>

                  {/* Encabezado del formulario */}
                  <div className="auth-header">
                    <h1>Acceso</h1>
                    <p>Inicia sesión en tu cuenta</p>
                  </div>

                  {/* ===========================
                      🧑 Usuario / Correo
                     =========================== */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username or Email"
                      autoComplete="username"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                    />
                  </CInputGroup>

                  {/* ===========================
                      🔒 Contraseña con botón dentro
                     =========================== */}
                  <CInputGroup className="mb-4 password-wrapper">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>

                    {/* Input de contraseña */}
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Botón pequeño dentro del input */}
                    <button
                      type="button"
                      className="btn-ver-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </CInputGroup>

                  {/* Mensaje de error */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* ===========================
                      🔘 Botones de acción
                     =========================== */}
                  <CRow>
                    <CCol xs={6}>
                      <CButton color="primary" type="submit">
                        Login
                      </CButton>
                    </CCol>

                    {/* Enlace recuperación de contraseña */}
                    <CCol xs={6} className="text-right">
                      <CButton
                        color="link"
                        onClick={() => navigate('/recover/password')}
                      >
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>

              {/* Panel derecho con sección de registro */}
              <CCard className="auth-card-right">
                <CCardBody>
                  <h2>Registro</h2>
                  <p>
                    "Únete a nuestra comunidad y cuida de tus mascotas con los mejores profesionales.
                     Regístrate ahora para acceder a nuestros servicios exclusivos."
                  </p>
                  <Link to="/register">
                    <CButton className="mt-3">¡Regístrate!</CButton>
                  </Link>
                </CCardBody>
              </CCard>

            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login