import React, { useState } from 'react';
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
  CModalFooter
} from '@coreui/react';
import { cilHeart, cilCalendar } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/pets/MyPets.css';

const MyPets = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  // Datos de ejemplo
  const pets = [
    {
      id: 1,
      name: 'Max',
      species: 'dog',
      breed: 'Golden Retriever',
      age: '3 years',
      weight: '25 kg',
      color: 'Golden',
      description: 'Friendly and energetic golden retriever',
      medicalHistory: [
        { date: '2024-01-15', procedure: 'Vaccination', vet: 'Dr. Smith' },
        { date: '2024-03-20', procedure: 'Checkup', vet: 'Dr. Johnson' }
      ]
    },
    {
      id: 2,
      name: 'Luna',
      species: 'cat',
      breed: 'Siamese',
      age: '2 years',
      weight: '4 kg',
      color: 'White/Brown',
      description: 'Calm and affectionate siamese cat',
      medicalHistory: [
        { date: '2024-02-10', procedure: 'Vaccination', vet: 'Dr. Wilson' }
      ]
    }
  ];

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

  // Placeholder simple sin imágenes externas
  const PetPlaceholder = ({ species, name }) => {
    const color = species === 'dog' ? '#4f46e5' : '#ec4899';
    const emoji = species === 'dog' ? '🐶' : '🐱';
    
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
                          ⚖️ {pet.weight}
                        </small>
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

      {/* Modal de detalles de mascota */}
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
                    <strong>Weight:</strong> {selectedPet.weight}
                  </div>
                  <div className="detail-item">
                    <strong>Color:</strong> {selectedPet.color}
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
          >
            View Medical History
          </CButton>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de historial médico */}
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
          {selectedPet?.medicalHistory?.length > 0 ? (
            <div className="medical-history">
              {selectedPet.medicalHistory.map((record, index) => (
                <div key={index} className="medical-record p-3 mb-2 border rounded">
                  <div className="d-flex justify-content-between">
                    <strong>{record.procedure}</strong>
                    <span className="text-muted">{record.date}</span>
                  </div>
                  <div className="text-muted">Veterinarian: {record.vet}</div>
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