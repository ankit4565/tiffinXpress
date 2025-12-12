import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Wrapper component to protect routes that require authentication
 * 
 * Usage:
 * <Route element={<ProtectedRoute><MyComponent /></ProtectedRoute>} />
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f0eb'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#ff7a00'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
