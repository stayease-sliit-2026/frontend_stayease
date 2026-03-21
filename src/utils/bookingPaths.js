export const BOOKING_SERVICE_BASE = '/booking-service'

export const bookingPaths = {
  home: BOOKING_SERVICE_BASE,
  create: `${BOOKING_SERVICE_BASE}/create`,
  list: `${BOOKING_SERVICE_BASE}/my-bookings`,
  stats: `${BOOKING_SERVICE_BASE}/stats`,
  details: (id = ':id') => `${BOOKING_SERVICE_BASE}/details/${id}`,
}
