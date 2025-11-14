import React, { useState } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { cilSearch, cilUser, cilPencil, cilTrash, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/users/UserList.css';

const UserList = ({ users, onUserUpdate, onUserDelete, onUserAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filtrar usuarios basado en la búsqueda
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEdit = (userId) => {
    console.log('Editar usuario:', userId);
    // Aquí podrías abrir un modal o navegar a edición
    alert(`Editar usuario ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      onUserDelete(userId);
    }
  };

  const handleAddUser = () => {
    // Aquí podrías abrir un modal para agregar usuario
    // Por ahora simulamos agregar un usuario
    const newUser = {
      name: 'Nuevo Usuario',
      email: 'nuevo@example.com',
      role: 'Usuario',
      status: 'active',
      phone: '+1 234 567 8900'
    };
    onUserAdd(newUser);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Activo' },
      inactive: { color: 'secondary', text: 'Inactivo' },
      suspended: { color: 'warning', text: 'Suspendido' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      Administrador: 'danger',
      Editor: 'warning',
      Usuario: 'primary'
    };
    
    return <CBadge color={roleConfig[role] || 'secondary'}>{role}</CBadge>;
  };

  return (
    <CCard className="users-card user-list-container">
      <CCardHeader className="users-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Listado de Usuarios
          </h5>
          <CButton color="primary" onClick={handleAddUser}>
            <CIcon icon={cilPlus} className="me-2" />
            Agregar Usuario
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        {/* Barra de búsqueda */}
        <div className="user-search-container">
          <CInputGroup>
            <CInputGroupText className="user-search-icon">
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              className="user-search-input"
              placeholder="Buscar por nombre, email o rol..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Resetear a primera página al buscar
              }}
            />
          </CInputGroup>
        </div>

        {/* Tabla de usuarios */}
        <div className="user-table-container">
          <CTable responsive striped hover className="user-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Teléfono</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Fecha Creación</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>
                      <strong>#{user.id}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{user.name}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.phone}</CTableDataCell>
                    <CTableDataCell>{getRoleBadge(user.role)}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(user.status)}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="user-actions-container">
                        <CButton
                          color="primary"
                          size="sm"
                          className="user-action-btn user-action-btn-edit"
                          onClick={() => handleEdit(user.id)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="user-action-btn user-action-btn-delete"
                          onClick={() => handleDelete(user.id)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="text-center py-4">
                    <div className="users-empty-state">
                      <CIcon icon={cilUser} className="users-empty-state-icon" />
                      <h5>No se encontraron usuarios</h5>
                      <p className="text-muted">
                        {searchTerm 
                          ? 'No hay usuarios que coincidan con tu búsqueda' 
                          : 'No hay usuarios registrados en el sistema'
                        }
                      </p>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="user-pagination">
            <CPagination align="center">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </CPaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </CPaginationItem>
            </CPagination>
          </div>
        )}

        {/* Información de paginación */}
        <div className="user-pagination-info text-center mt-2">
          Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
          {searchTerm && ` (filtrados de ${users.length} total)`}
        </div>
      </CCardBody>
    </CCard>
  );
};

export default UserList;