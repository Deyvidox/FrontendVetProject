import React, { useState, useEffect } from 'react';
import { 
  CContainer,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CAlert,
  CSpinner,
  CBadge
} from '@coreui/react';
import { cilPlus, cilReload, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import UserList from "./UserList";
import UserStats from "./UserStats";
import UserRegister from "./UserRegister";
import '../../css/users/Users.css';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [serverStatus, setServerStatus] = useState('checking');

  // Configurar interceptor de axios para manejar tokens
  useEffect(() => {
    // Interceptor para agregar token a las peticiones
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de respuesta
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('authToken');
          setAlert({
            show: true,
            message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            type: 'danger'
          });
        }
        return Promise.reject(error);
      }
    );

    loadUsers();
  }, []);


  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Cargando usuarios desde el backend...');
      const response = await axios.get('https://vetproyectbackend.onrender.com./users/users', {
        params: {
          page: 1,
          limit: 100,
          status: 'Active'
        }
      });

      const { data } = response;
      
      if (data.type === "Successfully") {
        console.log('✅ Usuarios cargados:', data.message.users.length);
        
        // Transformar datos del backend al formato esperado por el frontend
        const transformedUsers = data.message.users.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          role: user.role_name || 'Client',
          department: 'Veterinaria', // Puedes personalizar esto
          position: user.role_name === 'Administrator' ? 'Administrador' : 
                   user.role_name === 'Veterinarian' ? 'Veterinario' : 'Cliente',
          status: user.status.toLowerCase(),
          createdAt: user.created_at,
          username: user.username,
          identification_number: user.identification_number,
          address: user.address,
          date_of_birth: user.date_of_birth,
          profile_photo: user.profile_photo
        }));
        
        setUsers(transformedUsers);
      } else {
        setError('Error al cargar usuarios: ' + data.message);
      }
      
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
      console.log('📝 Actualizando usuario:', updatedUser.id);
      
      const response = await axios.post(
        `https://vetproyectbackend.onrender.com./users/update/${updatedUser.id}`,
        {
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          username: updatedUser.username,
          phone: updatedUser.phone,
          address: updatedUser.address,
          date_of_birth: updatedUser.date_of_birth
        }
      );

      const { data } = response;
      
      if (data.type === "Successfully") {
        setAlert({
          show: true,
          message: 'Usuario actualizado exitosamente',
          type: 'success'
        });
        
        // Actualizar la lista de usuarios
        loadUsers();
      } else {
        setAlert({
          show: true,
          message: 'Error al actualizar: ' + data.message,
          type: 'danger'
        });
      }
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Error al actualizar usuario',
        type: 'danger'
      });
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
      return;
    }

    try {
      console.log('🗑️ Desactivando usuario:', userId);
      
      const response = await axios.delete(`https://vetproyectbackend.onrender.com./users/delete/${userId}`);
      
      const { data } = response;
      
      if (data.type === "Successfully") {
        setAlert({
          show: true,
          message: 'Usuario desactivado exitosamente',
          type: 'success'
        });
        
        // Actualizar la lista de usuarios
        loadUsers();
      } else {
        setAlert({
          show: true,
          message: 'Error al desactivar: ' + data.message,
          type: 'danger'
        });
      }
    } catch (error) {
      console.error('❌ Error desactivando usuario:', error);
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Error al desactivar usuario',
        type: 'danger'
      });
    }
  };

  const handleUserAdd = async (newUser) => {
    try {
      console.log('📝 Registrando nuevo usuario:', newUser);
      
      const response = await axios.post('https://vetproyectbackend.onrender.com./users/register', newUser);
      
      const { data } = response;
      
      if (data.type === "Successfully") {
        setAlert({
          show: true,
          message: 'Usuario registrado exitosamente',
          type: 'success'
        });
        
        // Cerrar modal y actualizar lista
        setShowRegisterModal(false);
        loadUsers();
      } else {
        setAlert({
          show: true,
          message: 'Error al registrar: ' + data.message,
          type: 'danger'
        });
      }
    } catch (error) {
      console.error('❌ Error registrando usuario:', error);
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Error al registrar usuario',
        type: 'danger'
      });
    }
  };

  const handleEditProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
  };

  const handleSearchUsers = async (searchTerm) => {
    try {
      setLoading(true);
      
      const response = await axios.post('https://vetproyectbackend.onrender.com./users/search', {
        search: searchTerm,
        limit: 50
      });

      const { data } = response;
      
      if (data.type === "Successfully") {
        const transformedUsers = data.message.users.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          role: user.role_name || 'Client',
          department: 'Veterinaria',
          position: user.role_name === 'Administrator' ? 'Administrador' : 
                   user.role_name === 'Veterinarian' ? 'Veterinario' : 'Cliente',
          status: user.status.toLowerCase(),
          createdAt: user.created_at
        }));
        
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error('❌ Error buscando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <CContainer fluid className="users-container px-4">
        <div className="users-loading-container">
          <div className="text-center">
            <CSpinner color="primary" />
            <p className="users-loading-text mt-3">Cargando usuarios...</p>
          </div>
        </div>
      </CContainer>
    );
  }

  return (
    <CContainer fluid className="users-container px-4">
      {/* Alertas */}
      {alert.show && (
        <CAlert 
          color={alert.type} 
          dismissible 
          onClose={() => setAlert({ ...alert, show: false })}
          className="mt-4"
        >
          {alert.message}
        </CAlert>
      )}

      {/* Estado del servidor */}
      {serverStatus === 'offline' && (
        <CAlert color="danger" className="mt-4">
          ⚠️ No se puede conectar al servidor. Algunas funciones pueden no estar disponibles.
        </CAlert>
      )}

      {/* Header y controles */}
      <CRow className="mt-4 mb-4">
        <CCol xs={12} md={6}>
          <h1 className="users-title">
            <CIcon icon={cilUser} className="me-2" />
            Gestión de Usuarios
          </h1>
          <p className="users-subtitle">
            Administra los usuarios del sistema veterinario
          </p>
        </CCol>
        <CCol xs={12} md={6} className="text-end">
          <div className="d-flex gap-2 justify-content-end">
            <CButton 
              color="secondary" 
              onClick={loadUsers}
              disabled={loading || serverStatus !== 'online'}
            >
              <CIcon icon={cilReload} className="me-1" />
              {loading ? 'Actualizando...' : 'Actualizar'}
            </CButton>
            <CButton 
              color="primary" 
              onClick={() => setShowRegisterModal(true)}
              disabled={serverStatus !== 'online'}
            >
              <CIcon icon={cilPlus} className="me-1" />
              Nuevo Usuario
            </CButton>
          </div>
        </CCol>
      </CRow>

      {/* Estadísticas */}
      <UserStats users={users} />

      {/* Lista de usuarios */}
      <div className="mt-4">
        <UserList 
          users={users} 
          onUserUpdate={handleEditProfile}
          onUserDelete={handleUserDelete}
          onUserAdd={handleUserAdd}
          onSearch={handleSearchUsers}
        />
      </div>

      {/* Modal de registro */}
      {showRegisterModal && (
        <UserRegister
          show={showRegisterModal}
          onClose={handleCloseRegisterModal}
          onSubmit={handleUserAdd}
        />
      )}

      {/* Modal de perfil */}
      {showProfileModal && (
        <ProfileModal
          show={showProfileModal}
          onClose={handleCloseProfileModal}
          userData={selectedUser}
          onSave={handleUserUpdate}
        />
      )}

      {/* Información del sistema */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <div className="system-info">
            <h6>Información del sistema:</h6>
            <div className="d-flex gap-4">
              <div>
                <small className="text-muted">Estado del servidor:</small>
                <CBadge color={serverStatus === 'online' ? 'success' : 'danger'} className="ms-2">
                  {serverStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
                </CBadge>
              </div>
              <div>
                <small className="text-muted">Total de usuarios:</small>
                <CBadge color="info" className="ms-2">{users.length}</CBadge>
              </div>
              <div>
                <small className="text-muted">API:</small>
                <CBadge color="secondary" className="ms-2">https://vetproyectbackend.onrender.com.</CBadge>
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Users;