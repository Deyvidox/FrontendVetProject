import React from 'react';

const InventoryTable = ({ inventory, onEdit, onDelete }) => {
    // Función auxiliar para definir el color según el estado
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Disponible':
            case 'Available':
                return { backgroundColor: '#2eb85c', color: 'white' }; // Verde
            case 'Agotado':
            case 'Out of Stock':
                return { backgroundColor: '#e55353', color: 'white' }; // Rojo
            case 'Interrumpido':
            case 'Discontinued':
                return { backgroundColor: '#f9b115', color: 'white' }; // Naranja
            default:
                return { backgroundColor: '#636f83', color: 'white' }; // Gris
        }
    };

    return (
        <div className="table-responsive rounded shadow" style={{ backgroundColor: '#252545' }}>
            <table className="table table-hover table-dark mb-0">
                <thead>
                    <tr>
                        <th className="border-secondary">Imagen</th>
                        <th className="border-secondary">Producto</th>
                        <th className="border-secondary">Categoría</th>
                        <th className="border-secondary">Existencias</th>
                        <th className="border-secondary">Precio</th>
                        <th className="border-secondary text-center">Estado</th>
                        <th className="border-secondary">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.length > 0 ? (
                        inventory.map((item) => (
                            <tr key={item.id}>
                                <td className="align-middle">
                                    <img 
                                        src={item.image_url || 'https://via.placeholder.com/50'} 
                                        alt={item.name} 
                                        className="rounded"
                                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td className="align-middle">
                                    <div className="d-flex flex-column">
                                        <span style={{ 
                                            color: '#ffffff', 
                                            fontWeight: 'bold', 
                                            fontSize: '1rem',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {item.name}
                                        </span>
                                        <small className="text-info" style={{ fontSize: '0.75rem' }}>
                                            #INV-{item.id}
                                        </small>
                                    </div>
                                </td>
                                <td className="align-middle">{item.type}</td>
                                <td className="align-middle text-center">{item.quantity}</td>
                                <td className="align-middle text-success font-weight-bold">
                                    ${parseFloat(item.unit_price || 0).toFixed(2)}
                                </td>
                                <td className="align-middle text-center">
                                    <span 
                                        className="badge" 
                                        style={{
                                            ...getStatusStyle(item.status),
                                            padding: '0.5em 0.8em',
                                            fontSize: '0.85rem',
                                            minWidth: '95px',
                                            display: 'inline-block'
                                        }}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="align-middle">
                                    <div className="btn-group btn-group-sm">
                                        <button className="btn btn-outline-primary" onClick={() => onEdit(item)}>Editar</button>
                                        <button className="btn btn-outline-danger" onClick={() => onDelete(item.id)}>Borrar</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4 text-muted">
                                No se encontraron productos con esos filtros.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;