import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CSpinner
} from '@coreui/react';
import { cilHeart, cilCalendar } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/pets/MyPets.css';

const API_URL = "http://localhost:3001";

const MyPets = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/pets`);
        if (!response.ok) {
          throw new Error('Error loading pets');
        }
        
        const petsData = await response.json();
        setPets(petsData);
      } catch (error) {
        console.error('Error loading pets:', error);
        setError('Failed to load pets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleViewMedicalHistory = () => {
    setShowMedicalHistory(true);
  };

  const getSpeciesIcon = (species) => {
    return cilHeart;
  };

  // Simple placeholder without external images
  const PetPlaceholder = ({ species, name }) => {
    const color = species === 'dog' ? '#4f46e5' : species === 'cat' ? '#ec4899' : '#10b981';
    const emoji = species === 'dog' ? '🐶' : species === 'cat' ? '🐱' : '🐦';
    
    return (
      <div 
        className="pet-placeholder"
        style={{
          backgroundColor: color,
          width: '100%',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '3rem'
        }}
      >
        <div>{emoji}</div>
        <div style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{name}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <CCard className="my-pets-card">
        <CCardBody>
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-2">Loading pets...</p>
          </div>
        </CCardBody>
      </CCard>
    );
  }

  if (error) {
    return (
      <CCard className="my-pets-card">
        <CCardBody>
          <CAlert color="danger">
            {error}
          </CAlert>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <>
      <CCard className="my-pets-card">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilHeart} className="me-2" />
            My Pets
          </h5>
        </CCardHeader>
        <CCardBody>
          {pets.length > 0 ? (
            <CRow>
              {pets.map(pet => (
                <CCol md={6} lg={4} key={pet.id} className="mb-4">
                  <CCard 
                    className="pet-card h-100" 
                    onClick={() => handlePetClick(pet)}
                    style={{ cursor: 'pointer' }}
                  >
                    <PetPlaceholder species={pet.species} name={pet.name} />
                    <CCardBody className="pet-card-body">
                      <div className="pet-species-badge">
                        <CIcon icon={getSpeciesIcon(pet.species)} />
                        <span className="text-capitalize">{pet.species}</span>
                      </div>
                      <h6 className="pet-name">{pet.name}</h6>
                      <p className="pet-breed text-muted">{pet.breed}</p>
                      <div className="pet-info">
                        <small className="text-muted">
                          <CIcon icon={cilCalendar} className="me-1" />
                          {pet.age}
                        </small>
                        <small className="text-muted ms-2">
                          ⚖️ {pet.weight} kg
                        </small>
                      </div>
                      <div className="pet-status">
                        <span className={`badge ${pet.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                          {pet.status}
                        </span>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          ) : (
            <div className="text-center py-5">
              <CIcon icon={cilHeart} size="3xl" className="text-muted mb-3" />
              <h5>No pets registered</h5>
              <p className="text-muted">Start by registering your first pet!</p>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Pet Details Modal */}
      <CModal 
        visible={showModal} 
        onClose={() => setShowModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={getSpeciesIcon(selectedPet?.species)} className="me-2" />
            {selectedPet?.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPet && (
            <CRow>
              <CCol md={6}>
                <PetPlaceholder species={selectedPet.species} name={selectedPet.name} />
              </CCol>
              <CCol md={6}>
                <div className="pet-details">
                  <h6 className="text-muted text-uppercase">Details</h6>
                  <div className="detail-item">
                    <strong>Species:</strong> 
                    <span className="text-capitalize">{selectedPet.species}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Breed:</strong> {selectedPet.breed}
                  </div>
                  <div className="detail-item">
                    <strong>Age:</strong> {selectedPet.age}
                  </div>
                  <div className="detail-item">
                    <strong>Weight:</strong> {selectedPet.weight} kg
                  </div>
                  <div className="detail-item">
                    <strong>Color:</strong> {selectedPet.color}
                  </div>
                  <div className="detail-item">
                    <strong>Owner:</strong> {selectedPet.owner}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {selectedPet.ownerEmail}
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong> 
                    <span className={`badge ${selectedPet.status === 'active' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                      {selectedPet.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Description:</strong> 
                    <p className="mt-1">{selectedPet.description}</p>
                  </div>
                </div>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="primary" 
            onClick={handleViewMedicalHistory}
            disabled={!selectedPet?.medical_history?.length}
          >
            View Medical History ({selectedPet?.medical_history?.length || 0})
          </CButton>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Medical History Modal */}
      <CModal 
        visible={showMedicalHistory} 
        onClose={() => setShowMedicalHistory(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            Medical History - {selectedPet?.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPet?.medical_history?.length > 0 ? (
            <div className="medical-history">
              {selectedPet.medical_history.map((record, index) => (
                <div key={index} className="medical-record p-3 mb-2 border rounded">
                  <div className="d-flex justify-content-between">
                    <strong>{record.procedure}</strong>
                    <span className="text-muted">{new Date(record.date).toLocaleDateString('en-US')}</span>
                  </div>
                  <div className="text-muted">Veterinarian: {record.veterinarian}</div>
                  {record.notes && (
                    <div className="mt-2">
                      <small>Notes: {record.notes}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-muted">No medical records found.</p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowMedicalHistory(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default MyPets;