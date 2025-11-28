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
  
  // Calculate role distribution
  const adminUsers = users.filter(user => user.role === 'Administrator').length;
  const veterinarianUsers = users.filter(user => user.role === 'Veterinarian').length;
  const clientUsers = users.filter(user => user.role === 'Client').length;
  const editorUsers = users.filter(user => user.role === 'Editor').length;
  const regularUsers = users.filter(user => user.role === 'User').length;
  
  const activePercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  const inactivePercentage = totalUsers > 0 ? (inactiveUsers / totalUsers) * 100 : 0;

  const statsCards = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: cilUser,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #321fdb 0%, #1f1498 100%)',
      description: 'Users registered in the system'
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: cilUserFollow,
      color: 'success',
      gradient: 'linear-gradient(135deg, #2eb85c 0%, #1f8c3f 100%)',
      percentage: activePercentage,
      description: 'Users with system access'
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers,
      icon: cilUserUnfollow,
      color: 'warning',
      gradient: 'linear-gradient(135deg, #f9b115 0%, #d99400 100%)',
      percentage: inactivePercentage,
      description: 'Users with no recent activity'
    },
    {
      title: 'Administrators',
      value: adminUsers,
      icon: cilUser,
      color: 'danger',
      gradient: 'linear-gradient(135deg, #e55353 0%, #c23434 100%)',
      description: 'System administrators'
    }
  ];

  return (
    <div className="user-stats-container">
      {/* Statistics Header */}
      <div className="stats-header">
        <div className="stats-header-content">
          <CIcon icon={cilChart} className="stats-header-icon" />
          <div>
            <h2 className="stats-title">Users Dashboard</h2>
            <p className="stats-subtitle">General overview of users status and distribution</p>
          </div>
        </div>
        <div className="stats-overview">
          <div className="stats-overview-item">
            <span className="stats-overview-label">Activity Rate</span>
            <span className="stats-overview-value">{activePercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
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
                      <span>Progress</span>
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

      {/* Role Distribution */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard>
            <CCardBody>
              <h5 className="mb-3">Role Distribution</h5>
              <CRow>
                <CCol md={2} className="text-center">
                  <div className="role-stat">
                    <h4 className="text-primary">{adminUsers}</h4>
                    <small>Administrators</small>
                  </div>
                </CCol>
                <CCol md={2} className="text-center">
                  <div className="role-stat">
                    <h4 className="text-warning">{veterinarianUsers}</h4>
                    <small>Veterinarians</small>
                  </div>
                </CCol>
                <CCol md={2} className="text-center">
                  <div className="role-stat">
                    <h4 className="text-info">{clientUsers}</h4>
                    <small>Clients</small>
                  </div>
                </CCol>
                <CCol md={2} className="text-center">
                  <div className="role-stat">
                    <h4 className="text-success">{editorUsers}</h4>
                    <small>Editors</small>
                  </div>
                </CCol>
                <CCol md={2} className="text-center">
                  <div className="role-stat">
                    <h4 className="text-secondary">{regularUsers}</h4>
                    <small>Users</small>
                  </div>
                </CCol>
                <CCol md={2} className="text-center">
                  <div className="role-stat">
                    <h4 className="text-dark">{totalUsers}</h4>
                    <small>Total</small>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default UserStats;