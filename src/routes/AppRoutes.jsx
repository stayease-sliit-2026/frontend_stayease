import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import PaymentCenter from '../pages/PaymentCenter';
import Login from '../pages/auth_pages/Login';
import Register from '../pages/auth_pages/Register';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import HotelServiceRoutes from './HotelServiceRoutes';
import HotelAdminRoutes from './HotelAdminRoutes';
import BookingServiceRoutes from './BookingServiceRoutes';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../pages/admin_pages/dashboard';
import AdminLogin from '../pages/admin_pages/AdminLogin';
import AdminRegister from '../pages/admin_pages/AdminRegister';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  const userToken = sessionStorage.getItem('authToken');
  const adminToken = sessionStorage.getItem('adminAuthToken');

  const hasUserToken = Boolean(userToken && userToken !== 'undefined' && userToken !== 'null');
  const hasAdminToken = Boolean(adminToken && adminToken !== 'undefined' && adminToken !== 'null');

  if (!hasAdminToken && !hasUserToken) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (hasAdminToken) {
    return (
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/hotel-admin/*" element={<HotelAdminRoutes />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/hotel-service/*" element={<HotelServiceRoutes />} />
      <Route path="/hotel-admin/*" element={<HotelAdminRoutes />} />
      <Route
        path="/booking-service/*"
        element={
          <ProtectedRoute>
            <BookingServiceRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="/payments" element={<PaymentCenter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
