import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;