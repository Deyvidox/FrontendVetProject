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
import '../../css/login/Login.css'

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const dataFromRegister = location.state || {}

  const [usuario, setUsuario] = useState(
    dataFromRegister.usuario || dataFromRegister.correo || ''
  )

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Aquí irá la conexión a tu backend
      // Ejemplo: const res = await fetch('tu-backend-url/api/auth/login', {
      //   method: 'POST',
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ usuario, password })
      // });
      
      // Simulación de login exitoso
      const usuarioEncontrado = { id: 1, usuario, correo: usuario }
      
      if (usuario && password) {
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="auth-card">

              <CCardBody className="auth-card-inner">
                <CForm className="auth-form" onSubmit={handleLogin}>

                  <div className="auth-header">
                    <h1>Acceso</h1>
                    <p>Inicia sesión en tu cuenta</p>
                  </div>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username or Email"
                      autoComplete="username"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      disabled={loading}
                    />
                  </CInputGroup>

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
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="btn-ver-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </CInputGroup>

                  {error && <p className="text-danger">{error}</p>}

                  <CRow>
                    <CCol xs={6}>
                      <CButton color="primary" type="submit" disabled={loading}>
                        {loading ? "Iniciando..." : "Login"}
                      </CButton>
                    </CCol>

                    <CCol xs={6} className="text-right">
                      <CButton
                        color="link"
                        onClick={() => navigate('/recover/password')}
                        disabled={loading}
                      >
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>

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