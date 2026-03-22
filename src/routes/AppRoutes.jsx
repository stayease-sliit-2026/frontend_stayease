import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Home from '../pages/Home';
import PaymentCenter from '../pages/PaymentCenter';
import Login from '../pages/auth_pages/Login';
import Register from '../pages/auth_pages/Register';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
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
	const location = useLocation();
	const [hasUserToken, setHasUserToken] = useState(() => !!sessionStorage.getItem('authToken'));
	const [hasAdminToken, setHasAdminToken] = useState(() => !!sessionStorage.getItem('adminAuthToken'));
	// const userTokenRef = useRef(hasUserToken);
	// const adminTokenRef = useRef(hasAdminToken);

	// useEffect(() => {
	// 	const checkTokens = () => {
	// 		const userToken = !!sessionStorage.getItem('authToken');
	// 		const adminToken = !!sessionStorage.getItem('adminAuthToken');
	// 		if (userToken !== userTokenRef.current) {
	// 			userTokenRef.current = userToken;
	// 			setHasUserToken(userToken);
	// 		}
	// 		if (adminToken !== adminTokenRef.current) {
	// 			adminTokenRef.current = adminToken;
	// 			setHasAdminToken(adminToken);
	// 		}
	// 	};
	// 	window.addEventListener('storage', checkTokens);
	// 	return () => {
	// 		window.removeEventListener('storage', checkTokens);
	// 	};
	// }, []);

	// 🔐 NOT LOGGED IN
	if (sessionStorage.getItem('adminAuthToken') === null && sessionStorage.getItem('authToken') === null) {
		return (
			<Routes >
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route path="/admin/register" element={<AdminRegister />} />
				<Route path="*" element={location.pathname === "/login" ? <Login /> : <Navigate to="/login" replace />} />
			</Routes>
		);
	}

	// 🛠 ADMIN
	if (sessionStorage.getItem('adminAuthToken')) {
		return (
			<Routes>
				<Route path="/admin/dashboard" element={<AdminDashboard />} />
				<Route path="/hotel-admin/*" element={<HotelAdminRoutes />} />
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route path="/admin/register" element={<AdminRegister />} />
				<Route
					path="*"
					element={location.pathname.startsWith('/hotel-admin') ? <Navigate to="/hotel-admin" replace /> : <Navigate to="/admin/dashboard" replace />}
				/>
			</Routes>
		);
	}

	// 👤 USER
	return (
		<Routes>
            <Route path='/home' element={<Home />} />
			<Route path="/" element={<Home />} />
			<Route path="/profile" element={
				<ProtectedRoute>
					<Profile />
				</ProtectedRoute>
			} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/admin/login" element={<AdminLogin />} />
			<Route path="/admin/register" element={<AdminRegister />} />
			<Route path="/admin/login" element={<AdminLogin />} />
			<Route path="/admin/register" element={<AdminRegister />} />
			<Route path="/" element={<Home />} />
			<Route path="/hotel-service/*" element={<HotelServiceRoutes />} />
			<Route path="/hotel-admin/*" element={<HotelAdminRoutes />} />
			<Route path="/booking-service/*" element={<ProtectedRoute><BookingServiceRoutes /></ProtectedRoute>} />
			<Route path="/payments" element={<PaymentCenter />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}