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
  CModal,
  CModalBody,
  CModalContent,
  CModalFooter,
  CModalHeader,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import '../../css/login/Login.css'
import axios from 'axios'

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [modal, setModal] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await axios.post("http://localhost:4000/login",
        { username, password }
      )

      setType(data.type)
      setMessage((data.type === "Successfully") ? data.message.text : data.message)
      setModal(true)

      // Si el login es exitoso
      if (data.type === "Successfully") {
        // Guardar el token en localStorage
        localStorage.setItem('authToken', data.message.token)
        
        // También podrías guardar información del usuario si la envías
        localStorage.setItem('userId', data.userId || '')
        localStorage.setItem('userPermissions', JSON.stringify(data.permissions || []))
        
        // Esperar un momento para mostrar el mensaje y luego redirigir
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      }
      
    } catch (err) {
      // Manejo de errores de conexión
      setType("Error")
      setMessage(err.response?.data?.message || "Error de conexión con el servidor")
      setModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>{type}</CModalHeader>
        <CModalBody>{message}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        required
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
                        required
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

                    <CRow>
                      <CCol>
                        <CButton 
                          color='primary' 
                          type='submit'
                          disabled={loading}
                        >
                          {loading ? 'Procesando...' : 'Login'}
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
    </>
  )
}

export default Login