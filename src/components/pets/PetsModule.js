import React from 'react';
import { CCard, CCardBody, CCol, CRow, CNav, CNavItem, CNavLink } from '@coreui/react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';

// Importación de subcomponentes del directorio pets
import MyPets from './MyPets';
import PetsList from './PetsList';
import RegisterPet from './RegisterPet';

const PetsModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Función para determinar la pestaña activa basada en la URL
  const getActiveTab = () => {
    if (location.pathname.includes('register')) return 'register';
    if (location.pathname.includes('list')) return 'list';
    return 'mypets';
  };

  return (
    <CRow>
      {/* Columna de Navegación Lateral (Menú de Gestión) */}
      <CCol md={3}>
        <CCard className="mb-4 shadow-sm">
          <CCardBody>
            <div className="mb-3 text-center">
              <h6 className="text-uppercase fw-bold text-muted small">Gestión de Pacientes</h6>
            </div>
            <CNav variant="pills" className="flex-column">
              <CNavItem>
                <CNavLink 
                  active={getActiveTab() === 'mypets'} 
                  onClick={() => navigate('mypets')} 
                  style={{ cursor: 'pointer' }}
                >
                  Mis Mascotas (Filtros)
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink 
                  active={getActiveTab() === 'list'} 
                  onClick={() => navigate('list')} 
                  style={{ cursor: 'pointer' }}
                >
                  Listado General
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink 
                  active={getActiveTab() === 'register'} 
                  onClick={() => navigate('register')} 
                  style={{ cursor: 'pointer' }}
                >
                  Registrar Nueva
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Columna de Contenido Dinámico */}
      <CCol md={9}>
        <Routes>
          {/* Implementación del filtro por categorías y edición desde vista Mis Mascotas */}
          <Route path="mypets" element={<MyPets />} />
          
          {/* Registro funcional con Cloudinary */}
          <Route path="register" element={<RegisterPet />} />
          
          {/* Listado con opciones de eliminación y actualización por campo */}
          <Route path="list" element={<PetsList />} />
          
          {/* Redirección por defecto a Mis Mascotas */}
          <Route path="/" element={<Navigate to="mypets" replace />} />
        </Routes>
      </CCol>
    </CRow>
  );
};

export default PetsModule;