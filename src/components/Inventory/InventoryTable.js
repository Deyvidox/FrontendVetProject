import React from 'react';
import { 
  CTable, CTableHead, CTableRow, CTableHeaderCell, 
  CTableBody, CTableDataCell, CButton, CAvatar 
} from '@coreui/react';
import { cilTrash, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const InventoryTable = ({ inventory, onEdit, onDelete }) => {
    
    // Configuración de colores para los estados (Badges) con alto contraste
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s.includes('disponible') || s.includes('available')) {
            return { backgroundColor: 'rgba(46, 184, 92, 0.2)', color: '#39ef7d', border: '1px solid #2eb85c' };
        }
        if (s.includes('agotado') || s.includes('out')) {
            return { backgroundColor: 'rgba(229, 83, 83, 0.2)', color: '#ff6666', border: '1px solid #e55353' };
        }
        if (s.includes('interrumpido') || s.includes('discontinued')) {
            return { backgroundColor: 'rgba(249, 177, 21, 0.2)', color: '#f9b115', border: '1px solid #f9b115' };
        }
        return { backgroundColor: 'rgba(99, 111, 131, 0.2)', color: '#aab3c2', border: '1px solid #636f83' };
    };

    return (
        <CTable align="middle" responsive hover className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ backgroundColor: '#1a1a36' }}>
            {/* BARRA DE ENCABEZADO EN BLANCO */}
            <CTableHead style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderBottom: '1px solid #2d2d5a' }}>
                <CTableRow>
                    <CTableHeaderCell className="ps-4 py-3 text-white fw-bold border-0 text-uppercase small" style={{ letterSpacing: '1px' }}>
                        Producto
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-white fw-bold border-0 text-uppercase small" style={{ letterSpacing: '1px' }}>
                        Categoría
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-white fw-bold border-0 text-uppercase small text-center" style={{ letterSpacing: '1px' }}>
                        Stock
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-white fw-bold border-0 text-uppercase small" style={{ letterSpacing: '1px' }}>
                        Precio Unit.
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-white fw-bold border-0 text-uppercase small text-center" style={{ letterSpacing: '1px' }}>
                        Estado
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-white fw-bold border-0 text-uppercase small text-center" style={{ letterSpacing: '1px' }}>
                        Acciones
                    </CTableHeaderCell>
                </CTableRow>
            </CTableHead>

            <CTableBody>
                {inventory.length > 0 ? (
                    inventory.map((item) => (
                        <CTableRow key={item.id} className="align-middle border-bottom border-secondary-subtle" style={{ backgroundColor: 'transparent' }}>
                            <CTableDataCell className="ps-4 py-3 border-0">
                                <div className="d-flex align-items-center">
                                    <CAvatar 
                                        size="xl" 
                                        src={item.image_url || 'https://via.placeholder.com/75?text=Prod'} 
                                        className="border border-2 border-secondary shadow-sm"
                                        style={{ backgroundColor: '#3b3b5e' }}
                                    />
                                    <div className="ms-3">
                                        {/* NOMBRE DEL PRODUCTO EN BLANCO */}
                                        <div className="fw-bold text-white" style={{ fontSize: '1rem' }}>
                                            {item.name}
                                        </div>
                                        <div className="text-info opacity-75 small">SKU: #INV-{item.id}</div>
                                    </div>
                                </div>
                            </CTableDataCell>
                            
                            <CTableDataCell className="border-0">
                                <span className="badge bg-dark text-info border border-info border-opacity-25 fw-normal">
                                    {item.type}
                                </span>
                            </CTableDataCell>

                            <CTableDataCell className="text-center border-0">
                                {/* STOCK EN BLANCO O AMARILLO SI ES BAJO */}
                                <div className={`fw-bold ${item.quantity < 5 ? 'text-warning' : 'text-white'}`} style={{ fontSize: '1rem' }}>
                                    {item.quantity}
                                    <span className="ms-1 fw-normal opacity-50 small">unids</span>
                                </div>
                            </CTableDataCell>

                            <CTableDataCell className="border-0">
                                {/* PRECIO EN BLANCO */}
                                <span className="fw-bold text-white" style={{ fontSize: '1.05rem' }}>
                                    ${parseFloat(item.unit_price || 0).toFixed(2)}
                                </span>
                            </CTableDataCell>

                            <CTableDataCell className="text-center border-0">
                                <span 
                                    className="badge rounded-pill" 
                                    style={{
                                        ...getStatusStyle(item.status),
                                        padding: '0.6em 1.2em',
                                        fontSize: '0.7rem',
                                        minWidth: '100px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {item.status}
                                </span>
                            </CTableDataCell>

                            <CTableDataCell className="text-center pe-4 border-0">
                                <div className="d-flex gap-2 justify-content-center">
                                    <CButton 
                                        color="info" 
                                        variant="outline" 
                                        size="sm" 
                                        className="px-3 rounded-pill border-opacity-50" 
                                        onClick={() => onEdit(item)}
                                    >
                                        <CIcon icon={cilPencil} className="text-info" />
                                    </CButton>
                                    <CButton 
                                        color="danger" 
                                        variant="outline" 
                                        size="sm" 
                                        className="px-3 rounded-pill border-opacity-50" 
                                        onClick={() => onDelete(item.id)}
                                    >
                                        <CIcon icon={cilTrash} />
                                    </CButton>
                                </div>
                            </CTableDataCell>
                        </CTableRow>
                    ))
                ) : (
                    <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center py-5 border-0">
                            <div className="fs-1 opacity-25">📦</div>
                            <p className="text-white fw-bold mb-0 opacity-75">No hay productos disponibles.</p>
                        </CTableDataCell>
                    </CTableRow>
                )}
            </CTableBody>
        </CTable>
    );
};

export default InventoryTable;