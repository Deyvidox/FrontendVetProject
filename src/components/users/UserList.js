import React, { useState, useEffect } from 'react';
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
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CPagination,
  CPaginationItem,
  CButton,
  CAlert,
  CSpinner,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import { cilSearch, cilUser, cilPencil, cilTrash, cilOptions, cilFilter, cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/users/UserList.css';
import axios from 'axios';

const UserList = ({ users, onUserUpdate, onUserDelete, onUserAdd, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const usersPerPage = 10;

  // Actualizar usuarios filtrados cuando cambien los filtros
  useEffect(() => {
    let result = users;

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      result = result.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.identification_number?.includes(searchTerm)
      );
    }

    // Aplicar filtro de rol
    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }

    // Aplicar filtro de estado
    if (filterStatus !== 'all') {
      result = result.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Resetear a primera página cuando se filtran
  }, [users, searchTerm, filterRole, filterStatus]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleEdit = (user) => {
    onUserUpdate(user);
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      await onUserDelete(userId);
    } catch (error) {
      setError('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/users/search/${userId}`);
      
      if (response.data.type === "Successfully") {
        const user = response.data.message.user;
        alert(`
          Información del usuario:
          
          ID: ${user.id}
          Nombre: ${user.first_name} ${user.last_name}
          Usuario: ${user.username}
          Email: ${user.email}
          Teléfono: ${user.phone}
          Identificación: ${user.identification_number}
          Dirección: ${user.address}
          Rol: ${user.role_name}
          Estado: ${user.status}
          Registrado: ${new Date(user.created_at).toLocaleDateString()}
        `);
      }
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
      setError('No se pudieron obtener los detalles del usuario');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Activo', icon: '🟢' },
      inactive: { color: 'secondary', text: 'Inactivo', icon: '⚫' },
      suspended: { color: 'warning', text: 'Suspendido', icon: '🟡' },
      Active: { color: 'success', text: 'Activo', icon: '🟢' },
      Inactive: { color: 'secondary', text: 'Inactivo', icon: '⚫' },
      Suspended: { color: 'warning', text: 'Suspendido', icon: '🟡' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status, icon: '❓' };
    return (
      <CBadge color={config.color}>
        {config.icon} {config.text}
      </CBadge>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      Administrator: { color: 'danger', icon: '👑' },
      Veterinarian: { color: 'warning', icon: '👨‍⚕️' },
      Client: { color: 'primary', icon: '👤' },
      Assistant: { color: 'info', icon: '👨‍💼' },
      Editor: { color: 'info', icon: '✏️' },
      User: { color: 'secondary', icon: '👤' }
    };
    
    const config = roleConfig[role] || { color: 'secondary', icon: '👤' };
    return (
      <CBadge color={config.color}>
        {config.icon} {role}
      </CBadge>
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  return (
    <CCard className="users-card user-list-container">
      <CCardHeader className="users-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Lista de Usuarios
            <CBadge color="primary" className="ms-2">
              {filteredUsers.length} usuarios
            </CBadge>
          </h5>
          <div className="d-flex gap-2">
            <CButton 
              color="light" 
              size="sm"
              onClick={handleClearFilters}
              disabled={!searchTerm && filterRole === 'all' && filterStatus === 'all'}
            >
              Limpiar filtros
            </CButton>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        {error && (
          <CAlert color="danger" className="mb-3" dismissible onClose={() => setError(null)}>
            {error}
          </CAlert>
        )}

        {/* Filtros */}
        <div className="filters-container mb-4">
          <CRow>
            <CCol md={6} lg={4}>
              <div className="mb-3">
                <label className="form-label small text-muted">Buscar</label>
                <CInputGroup>
                  <CInputGroupText className="user-search-icon">
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    className="user-search-input"
                    placeholder="Buscar por nombre, email, teléfono..."
                    value={searchTerm}
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                  />
                </CInputGroup>
              </div>
            </CCol>
            <CCol md={3} lg={3}>
              <div className="mb-3">
                <label className="form-label small text-muted">Filtrar por rol</label>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilFilter} />
                  </CInputGroupText>
                  <select 
                    className="form-control"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">Todos los roles</option>
                    <option value="Administrator">Administrador</option>
                    <option value="Veterinarian">Veterinario</option>
                    <option value="Client">Cliente</option>
                    <option value="Assistant">Asistente</option>
                  </select>
                </CInputGroup>
              </div>
            </CCol>
            <CCol md={3} lg={3}>
              <div className="mb-3">
                <label className="form-label small text-muted">Filtrar por estado</label>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilFilter} />
                  </CInputGroupText>
                  <select 
                    className="form-control"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </CInputGroup>
              </div>
            </CCol>
          </CRow>
        </div>

        {/* Tabla de usuarios */}
        <div className="user-table-container">
          <CTable responsive striped hover className="user-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Usuario</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Teléfono</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Registrado</CTableHeaderCell>
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
                      <div>
                        <strong>{user.username}</strong>
                        <small className="d-block text-muted">{user.identification_number}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{user.name}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.phone || '-'}</CTableDataCell>
                    <CTableDataCell>{getRoleBadge(user.role)}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(user.status)}</CTableDataCell>
                    <CTableDataCell>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="user-actions-container">
                        <CDropdown>
                          <CDropdownToggle color="secondary" size="sm">
                            <CIcon icon={cilOptions} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem onClick={() => handleViewDetails(user.id)}>
                              <CIcon icon={cilInfo} className="me-2" />
                              Ver detalles
                            </CDropdownItem>
                            <CDropdownItem onClick={() => handleEdit(user)}>
                              <CIcon icon={cilPencil} className="me-2" />
                              Editar
                            </CDropdownItem>
                            <CDropdownItem 
                              onClick={() => handleDelete(user.id)}
                              className="text-danger"
                            >
                              <CIcon icon={cilTrash} className="me-2" />
                              Desactivar
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center py-5">
                    <div className="users-empty-state">
                      <CIcon icon={cilUser} className="users-empty-state-icon" />
                      <h5>No se encontraron usuarios</h5>
                      <p className="text-muted">
                        {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                          ? 'No hay usuarios que coincidan con los filtros aplicados'
                          : 'No hay usuarios registrados en el sistema'
                        }
                      </p>
                      <CButton 
                        color="primary" 
                        size="sm"
                        onClick={handleClearFilters}
                        className="mt-2"
                      >
                        Limpiar filtros
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="user-pagination mt-4">
            <CPagination align="center">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </CPaginationItem>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Mostrar solo algunas páginas alrededor de la actual
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <CPaginationItem
                      key={pageNumber}
                      active={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </CPaginationItem>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <CPaginationItem key={pageNumber}>...</CPaginationItem>;
                }
                return null;
              })}
              
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
        <div className="user-pagination-info text-center mt-3">
          <small className="text-muted">
            Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
            {searchTerm && ` (filtrados de ${users.length} total)`}
            {filterRole !== 'all' && ` • Rol: ${filterRole}`}
            {filterStatus !== 'all' && ` • Estado: ${filterStatus}`}
          </small>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default UserList;