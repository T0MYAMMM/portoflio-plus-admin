import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkSession, extendSession } = useAuth();
  const location = useLocation();

  // Extend session on protected route access (user activity)
  useEffect(() => {
    if (isAuthenticated) {
      extendSession();
    }
  }, [isAuthenticated, extendSession, location.pathname]);

  // Check session validity
  const sessionValid = checkSession();

  if (!isAuthenticated || !sessionValid) {
    // Redirect to login with the attempted location
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute; 