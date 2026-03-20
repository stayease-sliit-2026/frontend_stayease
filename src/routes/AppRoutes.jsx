import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
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
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
