import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CAlert,
  CSpinner
} from '@coreui/react'
import { cilUser, cilSave, cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/users/UserRegister.css'

const API_URL = "http://localhost:3001";

const UserRegister = () => {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      role: e.target.role.value,
      department: e.target.department.value,
      position: e.target.position.value,
      bio: e.target.bio.value,
      username: e.target.username.value,
      password: e.target.password.value,
      status: 'active',
      avatar: '',
      createdAt: new Date().toISOString().split('T')[0]
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error registering user')
      }

      const createdUser = await response.json()
      
      setAlert({
        show: true,
        message: 'User registered successfully!',
        type: 'success'
      })
      
      // Reset form
      e.target.reset()
      
    } catch (error) {
      console.error('Error registering user:', error)
      setAlert({
        show: true,
        message: 'Error registering user. Please try again.',
        type: 'danger'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setAlert({ show: false, message: '', type: '' })
  }

  return (
    <div className="user-register-container">
      <CCard className="user-register-card">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Register User
          </h5>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <CAlert color={alert.type} className="mb-4">
              {alert.message}
            </CAlert>
          )}
          
          <CForm onSubmit={handleSubmit} onReset={handleReset}>
            {/* Personal Information Section */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon" />
                Personal Information
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="name" className="register-form-label required-field">
                      Full Name
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      name="name"
                      className="register-form-input"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="email" className="register-form-label required-field">
                      Email
                    </CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      className="register-form-input"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="phone" className="register-form-label">
                      Phone
                    </CFormLabel>
                    <CFormInput
                      type="tel"
                      id="phone"
                      name="phone"
                      className="register-form-input"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="username" className="register-form-label required-field">
                      Username
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="username"
                      name="username"
                      className="register-form-input"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Professional Information Section */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon" />
                Professional Information
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="role" className="register-form-label required-field">
                      Role
                    </CFormLabel>
                    <CFormSelect id="role" name="role" className="register-form-select" required>
                      <option value="">Select a role</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Veterinarian">Veterinarian</option>
                      <option value="Client">Client</option>
                      <option value="Editor">Editor</option>
                      <option value="User">User</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="department" className="register-form-label">
                      Department
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="department"
                      name="department"
                      className="register-form-input"
                      placeholder="Department"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="position" className="register-form-label">
                      Position
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="position"
                      name="position"
                      className="register-form-input"
                      placeholder="User position"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="bio" className="register-form-label">
                      Biography
                    </CFormLabel>
                    <CFormInput
                      as="textarea"
                      rows="3"
                      id="bio"
                      name="bio"
                      className="register-form-input"
                      placeholder="User biography and experience..."
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Security Section */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon" />
                Security
              </h6>
              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="password" className="register-form-label required-field">
                      Password
                    </CFormLabel>
                    <CFormInput
                      type="password"
                      id="password"
                      name="password"
                      className="register-form-input"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            <div className="d-flex gap-2 btn-group-responsive">
              <CButton 
                color="primary" 
                type="submit" 
                disabled={loading}
                className="register-btn-primary"
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Register User
                  </>
                )}
              </CButton>
              <CButton 
                color="secondary" 
                type="reset" 
                disabled={loading}
                className="register-btn-secondary"
              >
                <CIcon icon={cilReload} className="me-2" />
                Clear Form
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UserRegister;