import React from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink
} from '@coreui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/pets/PetsModule.css';

const PetsModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determinar la pestaña activa basada en la ruta
  const getActiveTab = () => {
    if (location.pathname.includes('/pets/register')) return 'register';
    if (location.pathname.includes('/pets/mypets')) return 'mypets';
    if (location.pathname.includes('/pets/list')) return 'petslist';
    return 'register'; // default
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab) => {
    switch(tab) {
      case 'register':
        navigate('/pets/register');
        break;
      case 'mypets':
        navigate('/pets/mypets');
        break;
      case 'petslist':
        navigate('/pets/list');
        break;
      default:
        navigate('/pets/register');
    }
  };

  return (
    <div className="pets-module">
      <CCard>
        <CCardBody>
          <CRow>
            <CCol md={3}>
              <h4 className="pets-module-title">Pets Management</h4>
              <CNav variant="pills" className="flex-column pets-nav">
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'register'}
                    onClick={() => handleTabChange('register')}
                    className="pets-nav-link"
                  >
                    Register Pet
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'mypets'}
                    onClick={() => handleTabChange('mypets')}
                    className="pets-nav-link"
                  >
                    My Pets
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'petslist'}
                    onClick={() => handleTabChange('petslist')}
                    className="pets-nav-link"
                  >
                    Pets List
                  </CNavLink>
                </CNavItem>
              </CNav>
            </CCol>
            <CCol md={9}>
              {/* El contenido se renderiza por ruta individual */}
              <div className="pets-content-area">
                <p>Selecciona una opción del menú para comenzar.</p>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default PetsModule;