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
  CPaginationItem,
  CAlert
} from '@coreui/react';
import { cilSearch, cilUser, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/users/UserList.css';

const UserList = ({ users, onUserUpdate, onUserDelete, onUserAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usersPerPage = 5;

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEdit = async (userId) => {
    console.log('Edit user:', userId);
    // Aquí podrías abrir un modal de edición
    try {
      setLoading(true);
      // Lógica para editar usuario
    } catch (error) {
      setError('Error editing user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await onUserDelete(userId);
      } catch (error) {
        setError('Error deleting user');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Active' },
      inactive: { color: 'secondary', text: 'Inactive' },
      suspended: { color: 'warning', text: 'Suspended' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      Administrator: 'danger',
      Veterinarian: 'warning',
      Client: 'primary',
      Editor: 'info',
      User: 'secondary'
    };
    
    return <CBadge color={roleConfig[role] || 'secondary'}>{role}</CBadge>;
  };

  return (
    <CCard className="users-card user-list-container">
      <CCardHeader className="users-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Users List
          </h5>
        </div>
      </CCardHeader>
      <CCardBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        {/* Search Bar */}
        <div className="user-search-container">
          <CInputGroup>
            <CInputGroupText className="user-search-icon">
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              className="user-search-input"
              placeholder="Search by name, email, role or department..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </CInputGroup>
        </div>

        {/* Users Table */}
        <div className="user-table-container">
          <CTable responsive striped hover className="user-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
                <CTableHeaderCell>Department</CTableHeaderCell>
                <CTableHeaderCell>Position</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Created At</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
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
                    <CTableDataCell>{user.department}</CTableDataCell>
                    <CTableDataCell>{user.position}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(user.status)}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(user.createdAt).toLocaleDateString('en-US')}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="user-actions-container">
                        <CButton
                          color="primary"
                          size="sm"
                          className="user-action-btn user-action-btn-edit"
                          onClick={() => handleEdit(user.id)}
                          disabled={loading}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="user-action-btn user-action-btn-delete"
                          onClick={() => handleDelete(user.id)}
                          disabled={loading}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="10" className="text-center py-4">
                    <div className="users-empty-state">
                      <CIcon icon={cilUser} className="users-empty-state-icon" />
                      <h5>No users found</h5>
                      <p className="text-muted">
                        {searchTerm 
                          ? 'No users match your search' 
                          : 'No users registered in the system'
                        }
                      </p>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="user-pagination">
            <CPagination align="center">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
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
                Next
              </CPaginationItem>
            </CPagination>
          </div>
        )}

        {/* Pagination Info */}
        <div className="user-pagination-info text-center mt-2">
          Showing {currentUsers.length} of {filteredUsers.length} users
          {searchTerm && ` (filtered from ${users.length} total)`}
        </div>
      </CCardBody>
    </CCard>
  );
};

export default UserList;