import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import ProfileModal from '../profile/Profilemodal'
import { useProfileModal } from '../../hooks/useProfileModal'

const AppHeaderDropdown = () => {
  const {
    showProfileModal,
    openProfileModal,
    closeProfileModal,
    updateUserProfile
  } = useProfileModal();

  // Datos del usuario actual (puedes obtenerlos de tu contexto o auth)
  const userData = {
    id: 1,
    name: 'david',
    email: 'david@gmail.com',
    phone: '+58424-5678900',
    role: 'admin',
    department: '...',
    position: '....',
    location: 'tachira',
    bio: '...',
    avatar: avatar8,
    joinDate: '2024-01-01',
    status: 'active'
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    openProfileModal(userData);
  };

  const handleLockAccount = (e) => {
    e.preventDefault();
    // Lógica para bloquear cuenta
    console.log('Bloquear cuenta');
  };

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
            {userData.name}
          </CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilBell} className="me-2" />
            Updates
            <CBadge color="info" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Messages
            <CBadge color="success" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilTask} className="me-2" />
            Tasks
            <CBadge color="danger" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilCommentSquare} className="me-2" />
            Comments
            <CBadge color="warning" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
            Settings
          </CDropdownHeader>
          
          {/* Profile Item - Ahora con funcionalidad */}
          <CDropdownItem href="#" onClick={handleProfileClick}>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          
          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilCreditCard} className="me-2" />
            Payments
            <CBadge color="secondary" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilFile} className="me-2" />
            Projects
            <CBadge color="primary" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          
          <CDropdownDivider />
          
          <CDropdownItem href="#" onClick={handleLockAccount}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Lock Account
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {/* Modal de Perfil */}
      <ProfileModal
        show={showProfileModal}
        onClose={closeProfileModal}
        userData={userData}
        onUpdate={updateUserProfile}
      />
    </>
  )
}

export default AppHeaderDropdown