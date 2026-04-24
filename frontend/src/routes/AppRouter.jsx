import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage    from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import GroupStagePage from '../pages/GroupStagePage';

// Componente para redirigir según rol
const RoleBasedRedirect = ({ children }) => {
  const { user, token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si el usuario es admin, ir al dashboard de admin
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" />;
  }

  // Si es usuario normal, ir al dashboard normal
  return children;
};

// Ruta protegida genérica
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

// Ruta solo para admin
const AdminRoute = ({ children }) => {
  const { user, token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Dashboard para usuarios normales */}
        <Route path="/dashboard" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        
        {/* Dashboard para admins */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboardPage /></AdminRoute>
        } />

        {/* Fase de grupos */}
        <Route path="/groups" element={
          <PrivateRoute><GroupStagePage /></PrivateRoute>
        } />
        
        {/* Redirección según rol */}
        <Route path="/home" element={
          <RoleBasedRedirect><DashboardPage /></RoleBasedRedirect>
        } />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
