import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import HomePage from '../pages/hotel_pages/HomePage';
import HotelDetailsPage from '../pages/hotel_pages/HotelDetailsPage';

function HotelServiceRoutes() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-[#eaf7f5] to-slate-100 text-slate-900">
      <Navbar />
      <main>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="hotels/:id" element={<HotelDetailsPage />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default HotelServiceRoutes;
