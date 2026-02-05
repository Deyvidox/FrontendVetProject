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
  CButton,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CPagination,
  CPaginationItem,
  CAlert,
  CSpinner
} from '@coreui/react';
import { cilSearch, cilHeart, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/pets/PetsList.css';

const PetsList = ({ onPetUpdate, onPetDelete, onPetAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const petsPerPage = 5;

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Aquí irá la conexión a tu backend
        // Ejemplo: const response = await fetch('tu-backend-url/api/pets');
        // const petsData = await response.json();
        // setPets(petsData);
        
        setPets([]);
        
      } catch (error) {
        console.error('Error loading pets:', error);
        setError('Failed to load pets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  const filteredPets = pets.filter(pet =>
    pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.species?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  const handleEdit = (petId) => {
    console.log('Edit pet:', petId);
  };

  const handleDelete = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        setLoading(true);
        // Aquí irá la conexión a tu backend
        // Ejemplo: await fetch(`tu-backend-url/api/pets/${petId}`, { method: 'DELETE' });
        
        setPets(prevPets => prevPets.filter(pet => pet.id !== petId));
      } catch (error) {
        console.error('Error deleting pet:', error);
        setError('Error deleting pet');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Active' },
      inactive: { color: 'secondary', text: 'Inactive' },
      pending: { color: 'warning', text: 'Pending' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getSpeciesBadge = (species) => {
    const speciesConfig = {
      dog: { color: 'primary', text: 'Dog' },
      cat: { color: 'warning', text: 'Cat' },
      bird: { color: 'info', text: 'Bird' },
      rabbit: { color: 'success', text: 'Rabbit' },
      other: { color: 'secondary', text: 'Other' }
    };
    
    const config = speciesConfig[species] || { color: 'secondary', text: species };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  if (loading && pets.length === 0) {
    return (
      <CCard className="pets-card pets-list-container">
        <CCardBody>
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-2">Loading pets...</p>
          </div>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard className="pets-card pets-list-container">
      <CCardHeader className="pets-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilHeart} className="me-2" />
            Pets List
          </h5>
        </div>
      </CCardHeader>
      <CCardBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        <div className="pets-search-container">
          <CInputGroup>
            <CInputGroupText className="pets-search-icon">
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              className="pets-search-input"
              placeholder="Search by name, breed, owner or species..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </CInputGroup>
        </div>

        <div className="pets-table-container">
          <CTable responsive striped hover className="pets-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Species</CTableHeaderCell>
                <CTableHeaderCell>Breed</CTableHeaderCell>
                <CTableHeaderCell>Age</CTableHeaderCell>
                <CTableHeaderCell>Weight</CTableHeaderCell>
                <CTableHeaderCell>Owner</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Created At</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentPets.length > 0 ? (
                currentPets.map((pet) => (
                  <CTableRow key={pet.id}>
                    <CTableDataCell>
                      <strong>#{pet.id}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{pet.name}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{getSpeciesBadge(pet.species)}</CTableDataCell>
                    <CTableDataCell>{pet.breed}</CTableDataCell>
                    <CTableDataCell>{pet.age}</CTableDataCell>
                    <CTableDataCell>{pet.weight} kg</CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{pet.owner}</div>
                        <small className="text-muted">{pet.ownerEmail}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{getStatusBadge(pet.status)}</CTableDataCell>
                    <CTableDataCell>
                      {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString('en-US') : '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="pets-actions-container">
                        <CButton
                          color="primary"
                          size="sm"
                          className="pets-action-btn pets-action-btn-edit"
                          onClick={() => handleEdit(pet.id)}
                          disabled={loading}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="pets-action-btn pets-action-btn-delete"
                          onClick={() => handleDelete(pet.id)}
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
                    <div className="pets-empty-state">
                      <CIcon icon={cilHeart} className="pets-empty-state-icon" />
                      <h5>No pets found</h5>
                      <p className="text-muted">
                        {searchTerm 
                          ? 'No pets match your search' 
                          : 'No pets registered in the system'
                        }
                      </p>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        {totalPages > 1 && (
          <div className="pets-pagination">
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

        <div className="pets-pagination-info text-center mt-2">
          Showing {currentPets.length} of {filteredPets.length} pets
          {searchTerm && ` (filtered from ${pets.length} total)`}
        </div>
      </CCardBody>
    </CCard>
  );
};

export default PetsList;