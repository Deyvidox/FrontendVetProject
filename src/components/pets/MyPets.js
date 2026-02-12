import React, { useState, useEffect } from 'react';
import { 
  CRow, CCol, CCard, CCardBody, CCardImage, CCardTitle, CCardText, 
  CButton, CFormSelect, CSpinner, CBadge 
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilFilter } from '@coreui/icons';
import { getPets } from './PetService';
import EditPetModal from './EditPetModal'; // Componente que crearemos abajo

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas');
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await getPets({ categoria: filter });
      setPets(res.data);
    } catch (err) {
      console.error("Error cargando mascotas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [filter]);

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md={4}>
              <h4 className="mb-0">Mis Pacientes</h4>
            </CCol>
            <CCol md={8}>
              <div className="d-flex align-items-center justify-content-end">
                <CIcon icon={cilFilter} className="me-2" />
               <CFormSelect 
  className="shadow-sm"
  style={{ width: '250px' }}
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
>
  <option value="Todas">Todas las especies</option>
  <option value="Canino">Caninos </option>
  <option value="Felino">Felinos </option>
  <option value="Ave">Aves </option>
  <option value="Equino">Equinos </option>
  <option value="Reptil">Reptiles </option>
  <option value="Roedor">Roedores </option>
</CFormSelect>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {loading ? (
        <div className="text-center"><CSpinner color="primary" /></div>
      ) : (
        <CRow>
          {pets.map(pet => (
            <CCol sm={6} md={4} key={pet.id} className="mb-4">
              <CCard className="h-100 shadow-sm">
                <CCardImage 
                  orientation="top" 
                  src={pet.image_url || 'https://via.placeholder.com/150?text=Sin+Foto'} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <CCardBody>
                  <CCardTitle className="d-flex justify-content-between">
                    {pet.name}
                    <CBadge color="info">{pet.species_name}</CBadge>
                  </CCardTitle>
                  <CCardText className="small text-muted">
                    Raza: {pet.breed || 'N/A'}<br />
                    Dueño: {pet.owner_name}
                  </CCardText>
                  <CButton color="warning" size="sm" onClick={() => handleEdit(pet)}>
                    <CIcon icon={cilPencil} /> Editar Datos
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}

      {selectedPet && (
        <EditPetModal 
          visible={modalVisible} 
          setVisible={setModalVisible} 
          pet={selectedPet} 
          onUpdate={fetchPets}
        />
      )}
    </>
  );
};

export default MyPets;