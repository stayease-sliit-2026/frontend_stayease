import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import PaymentCenter from '../pages/PaymentCenter';
import Login from '../pages/auth_pages/Login';
import Register from '../pages/auth_pages/Register';
import NotFound from '../pages/NotFound';
import useAuth from '../hooks/useAuth';

function ProtectedRoute({ children }) {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/" element={<Home />} />
			<Route path="/payments" element={<PaymentCenter />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
