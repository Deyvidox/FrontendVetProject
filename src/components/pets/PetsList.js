import React, { useState, useEffect } from 'react';
import { 
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, 
  CButton, CAvatar, CSpinner, CAlert
} from '@coreui/react';
import { cilTrash, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getPets, deletePet } from './PetService';
import EditPetModal from './EditPetModal';

const PetsList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getPets();
      setPets(res.data);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Función para mapear el estado a texto y color dinámico
  const getStatusDetails = (status) => {
    switch (status) {
      case 'Active':
        return { text: 'DISPONIBLE', color: '#10b981', border: 'rgba(16, 185, 129, 0.4)' };
      case 'Inactive':
        return { text: 'INACTIVO', color: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' };
      case 'Deceased':
        return { text: 'FALLECIDO', color: '#9ca3af', border: 'rgba(156, 163, 175, 0.4)' };
      default:
        return { text: status.toUpperCase(), color: '#fbbf24', border: 'rgba(251, 191, 36, 0.4)' };
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este registro?")) {
      try { await deletePet(id); loadData(); } 
      catch (err) { alert(err.response?.data?.message || "Error al eliminar."); }
    }
  };

  if (loading) return <div className="text-center py-5"><CSpinner color="info" /></div>;

  return (
    <>
      {error && <CAlert color="danger" className="border-0 shadow">{error}</CAlert>}
      
      <div 
        className="p-4 shadow-lg" 
        style={{ 
          backgroundColor: '#1c222d', 
          borderRadius: '20px', 
          minHeight: 'auto' 
        }}
      >
        <CTable align="middle" responsive className="border-0 m-0">
          <CTableHead>
            <CTableRow style={{ borderBottom: '1.5px solid rgba(255, 255, 255, 0.8)' }}>
              <CTableHeaderCell className="text-uppercase small fw-bold py-3 border-0" style={{ color: '#9ca3af', letterSpacing: '1px' }}>Paciente</CTableHeaderCell>
              <CTableHeaderCell className="text-uppercase small fw-bold py-3 border-0" style={{ color: '#9ca3af', letterSpacing: '1px' }}>Especie/Raza</CTableHeaderCell>
              <CTableHeaderCell className="text-uppercase small fw-bold py-3 border-0" style={{ color: '#9ca3af', letterSpacing: '1px' }}>Propietario</CTableHeaderCell>
              <CTableHeaderCell className="text-uppercase small fw-bold py-3 border-0 text-center" style={{ color: '#9ca3af', letterSpacing: '1px' }}>Estado</CTableHeaderCell>
              <CTableHeaderCell className="text-uppercase small fw-bold py-3 border-0 text-center" style={{ color: '#9ca3af', letterSpacing: '1px' }}>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {pets.map(pet => {
              const statusInfo = getStatusDetails(pet.status); // Obtenemos el estilo según el estado real
              
              return (
                <CTableRow key={pet.id} className="border-0">
                  <CTableDataCell className="py-4 border-0">
                    <div className="d-flex align-items-center">
                      <CAvatar 
                        size="xl" 
                        src={pet.image_url || 'https://via.placeholder.com/100?text=S/F'} 
                        className="border border-secondary shadow-sm"
                      />
                      <div className="ms-3">
                        <div className="fw-bold text-white fs-5" style={{ letterSpacing: '0.5px' }}>{pet.name}</div>
                        <div style={{ color: '#60a5fa', fontSize: '0.85rem' }}>Identificación: #00{pet.id}</div>
                      </div>
                    </div>
                  </CTableDataCell>

                  <CTableDataCell className="border-0">
                    <span className="px-2 py-1 rounded border border-primary small" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#818cf8' }}>
                      {pet.species_name}
                    </span>
                    <div className="small mt-1" style={{ color: '#9ca3af' }}>{pet.breed || 'Siamés'}</div>
                  </CTableDataCell>

                  <CTableDataCell className="border-0">
                    <span className="fw-bold fs-6" style={{ color: '#ffb347' }}>{pet.owner_name}</span>
                  </CTableDataCell>

                  <CTableDataCell className="text-center border-0">
                    <span 
                      className="px-3 py-1 rounded-pill fw-bold small border" 
                      style={{
                        backgroundColor: 'transparent',
                        color: statusInfo.color,
                        borderColor: statusInfo.border,
                      }}
                    >
                      {statusInfo.text}
                    </span>
                  </CTableDataCell>

                  <CTableDataCell className="text-center border-0">
                    <div className="d-flex gap-2 justify-content-center">
                      <CButton 
                        color="primary" 
                        className="rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" 
                        style={{ width: '32px', height: '32px', backgroundColor: '#4f46e5', border: 'none' }}
                        onClick={() => { setSelectedPet(pet); setModalVisible(true); }}
                      >
                        <CIcon icon={cilPencil} size="sm" className="text-white" />
                      </CButton>
                      <CButton 
                        color="danger" 
                        className="rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" 
                        style={{ width: '32px', height: '32px', backgroundColor: '#dc2626', border: 'none' }}
                        onClick={() => handleDelete(pet.id)}
                      >
                        <CIcon icon={cilTrash} size="sm" className="text-white" />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </div>

      <EditPetModal 
        visible={modalVisible} 
        setVisible={setModalVisible} 
        pet={selectedPet} 
        onUpdate={loadData}
      />
    </>
  );
};

export default PetsList;