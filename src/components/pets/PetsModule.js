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
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import MyPets from './MyPets';
import PetsList from './PetsList';
import RegisterPet from './RegisterPet';
import '../../css/pets/PetsModule.css';

const PetsModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getActiveTab = () => {
    if (location.pathname.includes('/pets/register')) return 'register';
    if (location.pathname.includes('/pets/mypets')) return 'mypets';
    if (location.pathname.includes('/pets/list')) return 'petslist';
    return 'mypets';
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
        navigate('/pets/mypets');
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
                    active={activeTab === 'mypets'}
                    onClick={() => handleTabChange('mypets')}
                    className="pets-nav-link"
                  >
                    My Pets
                  </CNavLink>
                </CNavItem>
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
                    active={activeTab === 'petslist'}
                    onClick={() => handleTabChange('petslist')}
                    className="pets-nav-link"
                  >
                    All Pets
                  </CNavLink>
                </CNavItem>
              </CNav>
            </CCol>
            <CCol md={9}>
              <div className="pets-content-area">
                <Routes>
                  <Route path="mypets" element={<MyPets />} />
                  <Route path="register" element={<RegisterPet />} />
                  <Route path="list" element={<PetsList />} />
                  <Route path="/" element={<MyPets />} />
                </Routes>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default PetsModule;