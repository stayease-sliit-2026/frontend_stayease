
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth_pages/Login';
import Register from '../pages/auth_pages/Register';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../pages/admin_pages/dashboard';
import AdminLogin from '../pages/admin_pages/AdminLogin';

function ProtectedRoute({ children }) {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? children : <Navigate to="/login" replace />;
}


export default function AppRoutes() {
    if( !sessionStorage.getItem('adminAuthToken')) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route path="/admin/register" element={<Register />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        );
    }
       return (
	       <Routes>
		       <Route path="/login" element={<Login />} />
		       <Route path="/register" element={<Register />} />
		       <Route path="/" element={<Home />} />
		       <Route path="/profile" element={
			       <ProtectedRoute>
				       <Profile />
			       </ProtectedRoute>
		       } />
			   <Route path="/admin/login" element={<AdminLogin />} />
			   <Route path="/admin/dashboard" element={<AdminDashboard />} />
			   <Route path="*" element={<NotFound />} />
	       </Routes>
    );
}
