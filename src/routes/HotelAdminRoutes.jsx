import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import AdminPage from '../pages/admin/AdminPage';
import AdminHotelDetailsPage from '../pages/admin/AdminHotelDetailsPage';

function HotelAdminRoutes() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-[#eaf7f5] to-slate-100 text-slate-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<AdminPage />} />
          <Route path="/hotels/:id" element={<AdminHotelDetailsPage />} />
          <Route path="*" element={<Navigate to="/hotel-admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default HotelAdminRoutes;
