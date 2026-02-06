import React from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CProgress,
  CProgressBar,
  CBadge
} from '@coreui/react';
import { cilUser, cilUserFollow, cilUserUnfollow, cilBan, cilChart, cilGroup, cilPeople, cilShieldAlt } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/users/UserStats.css';

const UserStats = ({ users = [] }) => {
  // Calcular estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter(user => 
    user.status === 'active' || user.status === 'Active'
  ).length;
  const inactiveUsers = users.filter(user => 
    user.status === 'inactive' || user.status === 'Inactive'
  ).length;
  const suspendedUsers = users.filter(user => 
    user.status === 'suspended' || user.status === 'Suspended'
  ).length;
  
  // Calcular distribución por roles
  const adminUsers = users.filter(user => user.role === 'Administrator' || user.role === 'Administrador').length;
  const veterinarianUsers = users.filter(user => user.role === 'Veterinarian' || user.role === 'Veterinario').length;
  const clientUsers = users.filter(user => user.role === 'Client' || user.role === 'Cliente').length;
  const assistantUsers = users.filter(user => user.role === 'Assistant' || user.role === 'Asistente').length;
  
  // Porcentajes
  const activePercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  const inactivePercentage = totalUsers > 0 ? (inactiveUsers / totalUsers) * 100 : 0;
  const suspendedPercentage = totalUsers > 0 ? (suspendedUsers / totalUsers) * 100 : 0;

  // Tarjetas de estadísticas
  const statsCards = [
    {
      title: 'Total Usuarios',
      value: totalUsers,
      icon: cilGroup,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #321fdb 0%, #1f1498 100%)',
      description: 'Usuarios registrados en el sistema',
      trend: '+12% este mes'
    },
    {
      title: 'Usuarios Activos',
      value: activeUsers,
      icon: cilUserFollow,
      color: 'success',
      gradient: 'linear-gradient(135deg, #2eb85c 0%, #1f8c3f 100%)',
      percentage: activePercentage,
      description: 'Usuarios con acceso al sistema',
      trend: '+5% este mes'
    },
    {
      title: 'Usuarios Inactivos',
      value: inactiveUsers,
      icon: cilUserUnfollow,
      color: 'warning',
      gradient: 'linear-gradient(135deg, #f9b115 0%, #d99400 100%)',
      percentage: inactivePercentage,
      description: 'Usuarios sin actividad reciente',
      trend: '-2% este mes'
    },
    {
      title: 'Usuarios Suspendidos',
      value: suspendedUsers,
      icon: cilBan,
      color: 'danger',
      gradient: 'linear-gradient(135deg, #e55353 0%, #c23434 100%)',
      percentage: suspendedPercentage,
      description: 'Usuarios suspendidos temporalmente',
      trend: '0% este mes'
    }
  ];

  // Tarjetas de roles
  const roleCards = [
    {
      title: 'Administradores',
      value: adminUsers,
      icon: cilShieldAlt,
      color: 'danger',
      gradient: 'linear-gradient(135deg, #e55353 0%, #c23434 100%)',
      percentage: totalUsers > 0 ? (adminUsers / totalUsers) * 100 : 0,
      description: 'Administradores del sistema'
    },
    {
      title: 'Veterinarios',
      value: veterinarianUsers,
      icon: cilUser,
      color: 'warning',
      gradient: 'linear-gradient(135deg, #f9b115 0%, #d99400 100%)',
      percentage: totalUsers > 0 ? (veterinarianUsers / totalUsers) * 100 : 0,
      description: 'Personal veterinario'
    },
    {
      title: 'Clientes',
      value: clientUsers,
      icon: cilPeople,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #321fdb 0%, #1f1498 100%)',
      percentage: totalUsers > 0 ? (clientUsers / totalUsers) * 100 : 0,
      description: 'Clientes de la veterinaria'
    },
    {
      title: 'Asistentes',
      value: assistantUsers,
      icon: cilUser,
      color: 'info',
      gradient: 'linear-gradient(135deg, #39f 0%, #2980b9 100%)',
      percentage: totalUsers > 0 ? (assistantUsers / totalUsers) * 100 : 0,
      description: 'Personal de apoyo'
    }
  ];

  return (
    <div className="user-stats-container">
      {/* Encabezado de estadísticas */}
      <div className="stats-header mb-4">
        <div className="stats-header-content">
          <div className="stats-header-icon-container">
            <CIcon icon={cilChart} className="stats-header-icon" />
          </div>
          <div>
            <h2 className="stats-title">Dashboard de Usuarios</h2>
            <p className="stats-subtitle">Resumen general del estado y distribución de usuarios</p>
          </div>
        </div>
        <div className="stats-overview">
          <div className="stats-overview-item">
            <span className="stats-overview-label">Tasa de Actividad</span>
            <span className="stats-overview-value">{activePercentage.toFixed(1)}%</span>
          </div>
          <div className="stats-overview-item">
            <span className="stats-overview-label">Usuarios Nuevos</span>
            <span className="stats-overview-value">+{Math.floor(totalUsers * 0.12)}</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <CRow className="user-stats-row mb-4">
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
                    <span className={`stats-percentage ${stat.trend.includes('+') ? 'text-success' : stat.trend.includes('-') ? 'text-danger' : 'text-muted'}`}>
                      {stat.trend}
                    </span>
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
                      <span className="progress-label">Porcentaje</span>
                      <span className="progress-percentage">{stat.percentage.toFixed(1)}%</span>
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

      {/* Tarjetas de distribución por roles */}
      <div className="mb-4">
        <h5 className="section-title mb-3">
          <CIcon icon={cilUser} className="me-2" />
          Distribución por Roles
        </h5>
        <CRow>
          {roleCards.map((role, index) => (
            <CCol key={index} xs={12} sm={6} lg={3} className="mb-3">
              <CCard className="role-card">
                <CCardBody className="role-card-body">
                  <div className="role-card-header">
                    <div 
                      className="role-icon-container"
                      style={{ background: role.gradient }}
                    >
                      <CIcon icon={role.icon} className="role-icon" />
                    </div>
                    <div className="role-percentage">
                      <CBadge color={role.color} className="percentage-badge">
                        {role.percentage.toFixed(1)}%
                      </CBadge>
                    </div>
                  </div>
                  
                  <div className="role-content">
                    <h4 className="role-value">{role.value}</h4>
                    <p className="role-label">{role.title}</p>
                    <p className="role-description">{role.description}</p>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </div>

      {/* Resumen de actividad */}
      <CCard className="activity-summary-card">
        <CCardBody>
          <h5 className="mb-3">Resumen de Actividad</h5>
          <CRow>
            <CCol md={3} className="text-center">
              <div className="activity-stat">
                <div className="activity-value text-primary">{totalUsers}</div>
                <div className="activity-label">Total Registrados</div>
              </div>
            </CCol>
            <CCol md={3} className="text-center">
              <div className="activity-stat">
                <div className="activity-value text-success">{activeUsers}</div>
                <div className="activity-label">Activos Hoy</div>
              </div>
            </CCol>
            <CCol md={3} className="text-center">
              <div className="activity-stat">
                <div className="activity-value text-warning">{veterinarianUsers + assistantUsers}</div>
                <div className="activity-label">Personal</div>
              </div>
            </CCol>
            <CCol md={3} className="text-center">
              <div className="activity-stat">
                <div className="activity-value text-info">{clientUsers}</div>
                <div className="activity-label">Clientes</div>
              </div>
            </CCol>
          </CRow>
          
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Estado de Usuarios</span>
              <span>{activePercentage.toFixed(1)}% Activos</span>
            </div>
            <CProgress className="mb-3">
              <CProgressBar color="success" value={activePercentage} />
              <CProgressBar color="warning" value={inactivePercentage} />
              <CProgressBar color="danger" value={suspendedPercentage} />
            </CProgress>
            
            <div className="d-flex justify-content-between">
              <small className="text-success">
                <span className="status-dot bg-success"></span> Activos: {activeUsers}
              </small>
              <small className="text-warning">
                <span className="status-dot bg-warning"></span> Inactivos: {inactiveUsers}
              </small>
              <small className="text-danger">
                <span className="status-dot bg-danger"></span> Suspendidos: {suspendedUsers}
              </small>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UserStats;