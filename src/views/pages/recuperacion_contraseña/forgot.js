
import React, { useState } from 'react'
import { CButton, CForm, CFormInput } from '@coreui/react'
import './forgot.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return alert('Ingresa tu correo')
    alert(`Se ha enviado un enlace de recuperación a ${email}`)
    setEmail('')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-card-inner">
          <div className="auth-header">
            <h1>Recuperar contraseña</h1>
            <p>Ingresa tu correo para enviarte un enlace de recuperación</p>
          </div>

          <CForm onSubmit={handleSubmit} className="auth-form">
            {/* Campo de correo */}
            <CFormInput
              type="email"
              placeholder="Correo electrónico"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3"
            />

            {/* Botón */}
            <CButton type="submit" className="btn">
              Enviar enlace
            </CButton>
          </CForm>
        </div>

        {/* Panel derecho igual que login y registro */}
        <div className="auth-card-right">
          <h2>¿Olvidaste tu contraseña?</h2>
          <p>No te preocupes, te enviaremos un enlace para que puedas recuperarla.</p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

