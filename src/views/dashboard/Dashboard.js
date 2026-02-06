import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CProgress,
  CAlert,
  CButton,
  CListGroup,
  CListGroupItem,
  CProgressBar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilCalendar,
  cilHeart,
  cilUser,
  cilPaw,
  cilClipboard,
  cilBell,
  cilChartLine,
  cilClock,
  cilMedicalCross,
  cilStar,
  cilWarning,
  cilCheckCircle,
  cilInbox,
  cilShieldAlt,
} from '@coreui/icons';
import '../../css/dashboard/Dashboard.css'


const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPets: 0,
    upcomingAppointments: 0,
    pendingTasks: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    // Simulate user data loading
    const loadUserData = () => {
      setLoading(true);
      
      // In a real implementation, you would get the logged-in user's data
      const userData = JSON.parse(localStorage.getItem('usuarioLogueado')) || {
        id: 1,
        usuario: 'Demo User',
        correo: 'demo@vetclinic.com',
        role: 'Client',
      };
      
      setUserInfo(userData);
      
      // Simulate statistics based on user role
      const userRole = userData.role || 'Client';
      let mockStats = {
        totalPets: 0,
        upcomingAppointments: 0,
        pendingTasks: 0,
        recentActivity: 0,
      };

      switch(userRole) {
        case 'Administrator':
          mockStats = {
            totalPets: 45,
            upcomingAppointments: 12,
            pendingTasks: 8,
            recentActivity: 23,
          };
          break;
        case 'Veterinarian':
          mockStats = {
            totalPets: 28,
            upcomingAppointments: 6,
            pendingTasks: 3,
            recentActivity: 15,
          };
          break;
        case 'Client':
          mockStats = {
            totalPets: 2,
            upcomingAppointments: 1,
            pendingTasks: 0,
            recentActivity: 5,
          };
          break;
        default:
          mockStats = {
            totalPets: 0,
            upcomingAppointments: 0,
            pendingTasks: 0,
            recentActivity: 0,
          };
      }
      
      setStats(mockStats);
      setLoading(false);
    };

    loadUserData();
  }, []);

  // Example data for recent activities
  const recentActivities = [
    { id: 1, type: 'appointment', message: 'Appointment scheduled for "Max"', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'medical', message: 'Medical record updated', time: 'Yesterday', status: 'info' },
    { id: 3, type: 'reminder', message: 'Reminder: Pending vaccination', time: '3 days ago', status: 'warning' },
    { id: 4, type: 'system', message: 'Welcome to the veterinary system', time: '1 week ago', status: 'primary' },
  ];

  // Quick actions based on role
  const quickActions = {
    Administrator: [
      { icon: cilUser, label: 'Manage Users', path: '/users', color: 'primary' },
      { icon: cilPaw, label: 'View All Pets', path: '/pets/list', color: 'success' },
      { icon: cilCalendar, label: 'Appointment Calendar', path: '/appointments', color: 'info' },
      { icon: cilClipboard, label: 'Reports', path: '/reports', color: 'warning' },
    ],
    Veterinarian: [
      { icon: cilMedicalCross, label: "Today's Consultations", path: '/appointments', color: 'primary' },
      { icon: cilClipboard, label: 'Medical Records', path: '/medical-records', color: 'success' },
      { icon: cilBell, label: 'Notifications', path: '/notifications', color: 'info' },
      { icon: cilInbox, label: 'Messages', path: '/messages', color: 'warning' },
    ],
    Client: [
      { icon: cilPaw, label: 'My Pets', path: '/pets/mypets', color: 'primary' },
      { icon: cilCalendar, label: 'My Appointments', path: '/appointments', color: 'success' },
      { icon: cilHeart, label: 'Medical History', path: '/medical-history', color: 'info' },
      { icon: cilBell, label: 'Notifications', path: '/notifications', color: 'warning' },
    ],
  };

  // Pet health statistics (example)
  const petHealthStats = [
    { status: 'Healthy', count: 32, percentage: 65, color: 'success' },
    { status: 'Under Observation', count: 12, percentage: 25, color: 'warning' },
    { status: 'Needs Attention', count: 5, percentage: 10, color: 'danger' },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userRole = userInfo?.role || 'Client';
  const userDisplayName = userInfo?.usuario || 'User';
  const userEmail = userInfo?.correo || '';

  return (
    <div className="dashboard-container">
      {/* Welcome header */}
      <CCard className="mb-4 welcome-card">
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md={8}>
              <h1 className="dashboard-title mb-2">
                <CIcon icon={cilShieldAlt} className="me-2" />
                Welcome, {userDisplayName}!
              </h1>
              <p className="dashboard-subtitle text-muted mb-0">
                {userRole} • {userEmail}
              </p>
              <p className="dashboard-description mt-2">
                Veterinary Management System - Everything you need for your pets' care in one place.
              </p>
            </CCol>
            <CCol md={4} className="text-end">
              <div className="role-badge">
                <span className={`badge bg-${getRoleColor(userRole)}`}>
                  {userRole}
                </span>
              </div>
              <p className="small text-muted mt-2">
                Last access: Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Statistics cards */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} xl={3} className="mb-4">
          <CCard className="stats-card">
            <CCardBody className="text-center">
              <div className="stats-icon-container">
                <CIcon icon={cilPaw} className="stats-icon" />
              </div>
              <h3 className="stats-value mt-3">{stats.totalPets}</h3>
              <p className="stats-label">Pets</p>
              <p className="stats-description small text-muted">
                {userRole === 'Client' ? 'Your registered pets' : 'Total pets in the system'}
              </p>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} xl={3} className="mb-4">
          <CCard className="stats-card">
            <CCardBody className="text-center">
              <div className="stats-icon-container">
                <CIcon icon={cilCalendar} className="stats-icon" />
              </div>
              <h3 className="stats-value mt-3">{stats.upcomingAppointments}</h3>
              <p className="stats-label">Upcoming Appointments</p>
              <p className="stats-description small text-muted">
                {userRole === 'Client' ? 'Your scheduled appointments' : 'Appointments to attend'}
              </p>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} xl={3} className="mb-4">
          <CCard className="stats-card">
            <CCardBody className="text-center">
              <div className="stats-icon-container">
                <CIcon icon={cilClipboard} className="stats-icon" />
              </div>
              <h3 className="stats-value mt-3">{stats.pendingTasks}</h3>
              <p className="stats-label">Pending Tasks</p>
              <p className="stats-description small text-muted">
                {userRole === 'Client' ? 'Your pending tasks' : 'Tasks to complete'}
              </p>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} xl={3} className="mb-4">
          <CCard className="stats-card">
            <CCardBody className="text-center">
              <div className="stats-icon-container">
                <CIcon icon={cilChartLine} className="stats-icon" />
              </div>
              <h3 className="stats-value mt-3">{stats.recentActivity}</h3>
              <p className="stats-label">Recent Activity</p>
              <p className="stats-description small text-muted">
                Activities in the last 7 days
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Quick Actions */}
        <CCol lg={6} className="mb-4">
          <CCard className="h-100">
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilClock} className="me-2" />
                Quick Actions
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                {quickActions[userRole]?.map((action, index) => (
                  <CCol xs={6} className="mb-3" key={index}>
                    <CButton 
                      href={action.path}
                      color={action.color}
                      className="w-100 h-100 quick-action-btn"
                      style={{ 
                        minHeight: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CIcon icon={action.icon} size="xl" className="mb-2" />
                      <span className="small">{action.label}</span>
                    </CButton>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Pet Health Status */}
        <CCol lg={6} className="mb-4">
          <CCard className="h-100">
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilHeart} className="me-2" />
                Pet Health Status
              </h5>
            </CCardHeader>
            <CCardBody>
              {petHealthStats.map((stat, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small">{stat.status}</span>
                    <span className="small fw-semibold">
                      {stat.count} ({stat.percentage}%)
                    </span>
                  </div>
                  <CProgress className="mb-3">
                    <CProgressBar color={stat.color} value={stat.percentage} />
                  </CProgress>
                </div>
              ))}
              
              {userRole === 'Client' && stats.totalPets === 0 && (
                <CAlert color="info" className="mt-3">
                  <CIcon icon={cilPaw} className="me-2" />
                  You don't have any registered pets yet. 
                  <CButton color="link" href="/pets/register" className="p-0 ms-1">
                    Register your first pet!
                  </CButton>
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Recent Activity */}
        <CCol lg={12} className="mb-4">
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilBell} className="me-2" />
                Recent Activity
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                {recentActivities.map((activity) => (
                  <CListGroupItem key={activity.id} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <CIcon 
                        icon={getActivityIcon(activity.type)} 
                        className={`me-3 text-${activity.status}`} 
                      />
                      <div>
                        <div className="fw-semibold">{activity.message}</div>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                    <span className={`badge bg-${activity.status}`}>
                      {getActivityStatusText(activity.type)}
                    </span>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Important Reminders */}
      {userRole === 'Client' && (
        <CRow>
          <CCol lg={12}>
            <CCard>
              <CCardHeader>
                <h5 className="mb-0">
                  <CIcon icon={cilWarning} className="me-2" />
                  Important Reminders
                </h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={4}>
                    <CAlert color="warning">
                      <CIcon icon={cilMedicalCross} className="me-2" />
                      <strong>Vaccinations</strong>
                      <p className="mb-0 small">Check your pets' vaccination schedule.</p>
                    </CAlert>
                  </CCol>
                  <CCol md={4}>
                    <CAlert color="info">
                      <CIcon icon={cilCalendar} className="me-2" />
                      <strong>Upcoming Appointments</strong>
                      <p className="mb-0 small">Review and confirm your scheduled appointments.</p>
                    </CAlert>
                  </CCol>
                  <CCol md={4}>
                    <CAlert color="success">
                      <CIcon icon={cilCheckCircle} className="me-2" />
                      <strong>Updated History</strong>
                      <p className="mb-0 small">Keep your pets' medical history updated.</p>
                    </CAlert>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Tips and Suggestions */}
      <CCard className="mt-4">
        <CCardBody className="text-center">
          <CIcon icon={cilStar} className="text-warning mb-2" size="xl" />
          <h5 className="mb-2">Need Help?</h5>
          <p className="text-muted mb-3">
            Explore the different sections of the system or contact support if you have any questions.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <CButton color="primary" href="/help">
              Help Center
            </CButton>
            <CButton color="outline-primary" href="/contact">
              Contact Support
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

// Helper functions
const getRoleColor = (role) => {
  switch(role) {
    case 'Administrator': return 'danger';
    case 'Veterinarian': return 'warning';
    case 'Client': return 'primary';
    default: return 'secondary';
  }
};

const getActivityIcon = (type) => {
  switch(type) {
    case 'appointment': return cilCalendar;
    case 'medical': return cilMedicalCross;
    case 'reminder': return cilBell;
    case 'system': return cilShieldAlt;
    default: return cilCheckCircle;
  }
};

const getActivityStatusText = (type) => {
  switch(type) {
    case 'appointment': return 'Appointment';
    case 'medical': return 'Medical';
    case 'reminder': return 'Reminder';
    case 'system': return 'System';
    default: return 'General';
  }
};

export default Dashboard;