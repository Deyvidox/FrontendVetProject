import React, { useState, useEffect } from 'react';
import { CContainer } from '@coreui/react';
import UserList from "./UserList";
import UserStats from "./UserStats";
import '../../css/users/Users.css';

const API_URL = "http://localhost:3001";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
          throw new Error('Error loading users');
        }
        
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // CRUD Operations
  const handleUserUpdate = async (updatedUser) => {
    try {
      const response = await fetch(`${API_URL}/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Error updating user');
      }

      const updatedUserData = await response.json();
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUserData.id ? updatedUserData : user
        )
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting user');
      }

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const handleUserAdd = async (newUser) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          status: 'active',
          avatar: '',
          createdAt: new Date().toISOString().split('T')[0]
        }),
      });

      if (!response.ok) {
        throw new Error('Error adding user');
      }

      const createdUser = await response.json();
      setUsers(prevUsers => [...prevUsers, createdUser]);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <CContainer fluid className="users-container px-4">
        <div className="users-loading-container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="users-loading-text mt-2">Loading users...</p>
          </div>
        </div>
      </CContainer>
    );
  }

  if (error) {
    return (
      <CContainer fluid className="users-container px-4">
        <div className="users-error-container">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </CContainer>
    );
  }

  return (
    <CContainer fluid className="users-container px-4">
      <h1 className="users-title mt-4">Users Management</h1>
      
      {/* Statistics */}
      <UserStats users={users}/>
      
      {/* Users List */}
      <UserList 
        users={users} 
        onUserUpdate={handleUserUpdate}
        onUserDelete={handleUserDelete}
        onUserAdd={handleUserAdd}
      />
    </CContainer>
  );
};

export default Users;