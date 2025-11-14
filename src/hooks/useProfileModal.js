import { useState } from 'react';

export const useProfileModal = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const openProfileModal = (userData = null) => {
    setCurrentUser(userData);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setCurrentUser(null);
  };

  const updateUserProfile = (updatedData) => {
    // Aquí puedes conectar con tu contexto global o API
    console.log('Perfil actualizado:', updatedData);
    // Actualizar en el estado global o hacer llamada a API
  };

  return {
    showProfileModal,
    currentUser,
    openProfileModal,
    closeProfileModal,
    updateUserProfile
  };
};