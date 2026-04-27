import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BookingServiceHomePage from '../pages/booking_pages/BookingServiceHomePage';
import CreateBookingPage from '../pages/booking_pages/CreateBookingPage';
import UserBookingsPage from '../pages/booking_pages/UserBookingsPage';
import BookingDetailsPage from '../pages/booking_pages/BookingDetailsPage';
import BookingStatsPage from '../pages/booking_pages/BookingStatsPage';

function BookingServiceRoutes() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <Routes>
          <Route index element={<BookingServiceHomePage />} />
          <Route path="create" element={<CreateBookingPage />} />
          <Route path="my-bookings" element={<UserBookingsPage />} />
          <Route path="details/:id" element={<BookingDetailsPage />} />
          <Route path="stats" element={<BookingStatsPage />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default BookingServiceRoutes;
