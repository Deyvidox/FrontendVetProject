import React from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CProgress,
  CProgressBar
} from '@coreui/react';
import { cilUser, cilUserFollow, cilUserUnfollow, cilBan, cilChart } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/users/UserStats.css';

const UserStats = ({ users = [] }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;
  const suspendedUsers = users.filter(user => user.status === 'suspended').length;
  
  const activePercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  const inactivePercentage = totalUsers > 0 ? (inactiveUsers / totalUsers) * 100 : 0;
  const suspendedPercentage = totalUsers > 0 ? (suspendedUsers / totalUsers) * 100 : 0;

  const statsCards = [
    {
      title: 'Total Usuarios',
      value: totalUsers,
      icon: cilUser,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #321fdb 0%, #1f1498 100%)',
      description: 'Usuarios registrados en el sistema'
    },
    {
      title: 'Usuarios Activos',
      value: activeUsers,
      icon: cilUserFollow,
      color: 'success',
      gradient: 'linear-gradient(135deg, #2eb85c 0%, #1f8c3f 100%)',
      percentage: activePercentage,
      description: 'Usuarios con acceso al sistema'
    },
    {
      title: 'Usuarios Inactivos',
      value: inactiveUsers,
      icon: cilUserUnfollow,
      color: 'warning',
      gradient: 'linear-gradient(135deg, #f9b115 0%, #d99400 100%)',
      percentage: inactivePercentage,
      description: 'Usuarios sin actividad reciente'
    },
    {
      title: 'Usuarios Suspendidos',
      value: suspendedUsers,
      icon: cilBan,
      color: 'danger',
      gradient: 'linear-gradient(135deg, #e55353 0%, #c23434 100%)',
      percentage: suspendedPercentage,
      description: 'Usuarios con acceso restringido'
    }
  ];

  return (
    <div className="user-stats-container">
      {/* Header de Estadísticas */}
      <div className="stats-header">
        <div className="stats-header-content">
          <CIcon icon={cilChart} className="stats-header-icon" />
          <div>
            <h2 className="stats-title">Dashboard de Usuarios</h2>
            <p className="stats-subtitle">Resumen general del estado de los usuarios</p>
          </div>
        </div>
        <div className="stats-overview">
          <div className="stats-overview-item">
            <span className="stats-overview-label">Tasa de Actividad</span>
            <span className="stats-overview-value">{activePercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <CRow className="user-stats-row">
        {statsCards.map((stat, index) => (
          <CCol key={index} xs={12} sm={6} xl={3} className="mb-4">
            <CCard className="stats-card premium-card">
              <CCardBody className="stats-card-body">
                <div className="stats-card-header">
                  <div 
                    className="stats-icon-container"
                    style={{ background: stat.gradient }}
                  >
                    <CIcon icon={stat.icon} className="stats-icon" />
                  </div>
                  <div className="stats-trend">
                    <span className="stats-percentage">+2.5%</span>
                  </div>
                </div>
                
                <div className="stats-content">
                  <h3 className="stats-value">{stat.value}</h3>
                  <p className="stats-label">{stat.title}</p>
                  <p className="stats-description">{stat.description}</p>
                </div>

                {stat.percentage !== undefined && (
                  <div className="stats-progress">
                    <div className="progress-info">
                      <span>Progreso</span>
                      <span>{stat.percentage.toFixed(1)}%</span>
                    </div>
                    <CProgress className="stats-progress-bar">
                      <CProgressBar 
                        value={stat.percentage} 
                        style={{ background: stat.gradient }}
                      />
                    </CProgress>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  );
};

export default UserStats;