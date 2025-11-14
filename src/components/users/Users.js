import React, { useState, useEffect } from 'react';
import { CContainer } from '@coreui/react';
import UserList from "./UserList";
import UserStats from "./UserStats";
import '../../css/users/Users.css';

const data = [{
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'Administrador',
    status: 'active',
    phone: '+1 234 567 8900',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@example.com',
    role: 'Usuario',
    status: 'active',
    phone: '+1 234 567 8901',
    createdAt: '2024-01-16'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos@example.com',
    role: 'Editor',
    status: 'inactive',
    phone: '+1 234 567 8902',
    createdAt: '2024-01-17'
  },
  {
    id: 4,
    name: 'Ana Martínez',
    email: 'ana@example.com',
    role: 'Usuario',
    status: 'active',
    phone: '+1 234 567 8903',
    createdAt: '2024-01-18'
  }];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos desde API
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        setTimeout(() => {
          setUsers(data); // Usar los datos mock directamente
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Funciones para manejar CRUD
  const handleUserUpdate = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const handleUserDelete = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const handleUserAdd = (newUser) => {
    const user = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...newUser,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prevUsers => [...prevUsers, user]);
  };

  if (loading) {
    return (
      <CContainer fluid className="users-container px-4">
        <div className="users-loading-container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="users-loading-text mt-2">Cargando usuarios...</p>
          </div>
        </div>
      </CContainer>
    );
  }

  return (
    <CContainer fluid className="users-container px-4">
      <h1 className="users-title mt-4">Gestión de Usuarios</h1>
      
      {/* Estadísticas */}
      <UserStats users={users}/>
      
      {/* Listado de usuarios */}
      <UserList 
        users={users} 
        onUserUpdate={handleUserUpdate}
        onUserDelete={handleUserDelete}
        onUserAdd={handleUserAdd}
      />
    </CContainer>
  );
};

// CORRECTO: Exportar el componente, no ejecutarlo
export default Users;