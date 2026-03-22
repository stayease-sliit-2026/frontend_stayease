import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth_pages/Login';
import Register from '../pages/auth_pages/Register';
import NotFound from '../pages/NotFound';
import HotelServiceRoutes from './HotelServiceRoutes';
import HotelAdminRoutes from './HotelAdminRoutes';
import Profile from '../pages/Profile';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../pages/admin_pages/dashboard';
import AdminLogin from '../pages/admin_pages/AdminLogin';
import AdminRegister from '../pages/admin_pages/AdminRegister';

function ProtectedRoute({ children }) {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children, redirectTo }) {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? <Navigate to={redirectTo} replace /> : children;
}

export default function AppRoutes() {
	const { isAuthenticated: isUserAuthenticated } = useAuth();
	const isAdminAuthenticated = Boolean(sessionStorage.getItem('adminAuthToken'));

	// 🔐 NOT LOGGED IN
	if (!isAdminAuthenticated && !isUserAuthenticated) {
		return (
			<Routes >
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route path="/admin/register" element={<AdminRegister />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		);
	}

	// 🛠 ADMIN
	if (isAdminAuthenticated) {
		return (
			<Routes>
				<Route path="/admin/dashboard" element={<AdminDashboard />} />
				<Route path="/admin/login" element={<Navigate to="/admin/dashboard" replace />} />
				<Route path="/admin/register" element={<Navigate to="/admin/dashboard" replace />} />
				<Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
				<Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
			</Routes>
		);
	}

	// 👤 USER
	return (
		<Routes>
			<Route path='/home' element={<Home />} />
			<Route path="/" element={<Home />} />
			<Route path="/hotel-service/*" element={<HotelServiceRoutes />} />
			<Route path="/hotel-admin/*" element={<HotelAdminRoutes />} />
			<Route path="/profile" element={
				<ProtectedRoute>
					<Profile />
				</ProtectedRoute>
			} />
			<Route path="/login" element={
				<GuestRoute redirectTo="/home">
					<Login />
				</GuestRoute>
			} />
			<Route path="/register" element={
				<GuestRoute redirectTo="/home">
					<Register />
				</GuestRoute>
			} />
			<Route path="/admin/login" element={<AdminLogin />} />
			<Route path="/admin/register" element={<AdminRegister />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}