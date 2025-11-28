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

const API = "http://localhost:3001";

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Si el usuario viene del registro, recupero sus datos
  const dataFromRegister = location.state || {}

  // Estado del usuario (username o correo)
  const [usuario, setUsuario] = useState(
    dataFromRegister.usuario || dataFromRegister.correo || ''
  )

  // Estado de contraseña
  const [password, setPassword] = useState('')

  // Estado para mostrar / ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false)

  // Estado de error
  const [error, setError] = useState('')

  // ===========================
  // 🔐 Manejar proceso de Login
  // ===========================
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      // CONSULTA CORRECTA: ahora usamos /clientes
      const res = await fetch(`${API}/clientes`)
      const usuarios = await res.json()

      // Buscar si existe un usuario con username o email
      const usuarioEncontrado = usuarios.find(
        (u) =>
          (u.usuario === usuario || u.correo === usuario) &&
          u.contrasena === password
      )

      if (usuarioEncontrado) {
        alert(`Bienvenido, ${usuarioEncontrado.usuario} ✅`)

        // Guardar un mínimo de datos del usuario logueado
        localStorage.setItem(
          "usuarioLogueado",
          JSON.stringify({
            id: usuarioEncontrado.id,
            usuario: usuarioEncontrado.usuario,
            correo: usuarioEncontrado.correo,
          })
        )

        navigate('/dashboard')
      } else {
        setError("Usuario o contraseña incorrectos.")
      }

    } catch (err) {
      setError("Error al conectar con el servidor.")
    }
  }

  return (
    <div className="auth-wrapper">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="auth-card">

              {/* Panel izquierdo con el formulario */}
              <CCardBody className="auth-card-inner">
                <CForm className="auth-form" onSubmit={handleLogin}>

                  {/* Encabezado */}
                  <div className="auth-header">
                    <h1>Acceso</h1>
                    <p>Inicia sesión en tu cuenta</p>
                  </div>

                  {/* Usuario / Correo */}
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

                  {/* Contraseña */}
                  <CInputGroup className="mb-4 password-wrapper">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>

                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Botón mostrar contraseña */}
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

                  {/* Botones */}
                  <CRow>
                    <CCol xs={6}>
                      <CButton color="primary" type="submit">
                        Login
                      </CButton>
                    </CCol>

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

              {/* Panel derecho */}
              <CCard className="auth-card-right">
                <CCardBody>
                  <h2>Registro</h2>
                  <p>
                    Únete a nuestra comunidad y cuida de tus mascotas con los mejores profesionales.
                    Regístrate ahora para acceder a nuestros servicios exclusivos.
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
