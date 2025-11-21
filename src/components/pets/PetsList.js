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
import { cilSearch, cilHeart, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/pets/PetsList.css';

const PetsList = ({ pets = [], onPetUpdate, onPetDelete, onPetAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 5;

  // Filtrar mascotas basado en la búsqueda
  const filteredPets = pets.filter(pet =>
    pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.owner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  const handleEdit = (petId) => {
    console.log('Editar mascota:', petId);
    alert(`Editar mascota ID: ${petId}`);
  };

  const handleDelete = (petId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      onPetDelete?.(petId);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Activo' },
      inactive: { color: 'secondary', text: 'Inactivo' },
      pending: { color: 'warning', text: 'Pendiente' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getSpeciesBadge = (species) => {
    const speciesConfig = {
      dog: { color: 'primary', text: 'Perro' },
      cat: { color: 'warning', text: 'Gato' },
      bird: { color: 'info', text: 'Ave' },
      rabbit: { color: 'success', text: 'Conejo' },
      other: { color: 'secondary', text: 'Otro' }
    };
    
    const config = speciesConfig[species] || { color: 'secondary', text: species };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  return (
    <CCard className="pets-card pets-list-container">
      <CCardHeader className="pets-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilHeart} className="me-2" />
            Listado de Mascotas
          </h5>
        </div>
      </CCardHeader>
      <CCardBody>
        {/* Barra de búsqueda */}
        <div className="pets-search-container">
          <CInputGroup>
            <CInputGroupText className="pets-search-icon">
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              className="pets-search-input"
              placeholder="Buscar por nombre, raza o propietario..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </CInputGroup>
        </div>

        {/* Tabla de mascotas */}
        <div className="pets-table-container">
          <CTable responsive striped hover className="pets-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Especie</CTableHeaderCell>
                <CTableHeaderCell>Raza</CTableHeaderCell>
                <CTableHeaderCell>Edad</CTableHeaderCell>
                <CTableHeaderCell>Propietario</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
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
                    <CTableDataCell>{pet.owner}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(pet.status)}</CTableDataCell>
                    <CTableDataCell>
                      <div className="pets-actions-container">
                        <CButton
                          color="primary"
                          size="sm"
                          className="pets-action-btn pets-action-btn-edit"
                          onClick={() => handleEdit(pet.id)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="pets-action-btn pets-action-btn-delete"
                          onClick={() => handleDelete(pet.id)}
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
                    <div className="pets-empty-state">
                      <CIcon icon={cilHeart} className="pets-empty-state-icon" />
                      <h5>No se encontraron mascotas</h5>
                      <p className="text-muted">
                        {searchTerm 
                          ? 'No hay mascotas que coincidan con tu búsqueda' 
                          : 'No hay mascotas registradas en el sistema'
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
          <div className="pets-pagination">
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
        <div className="pets-pagination-info text-center mt-2">
          Mostrando {currentPets.length} de {filteredPets.length} mascotas
          {searchTerm && ` (filtrados de ${pets.length} total)`}
        </div>
      </CCardBody>
    </CCard>
  );
};

export default PetsList;