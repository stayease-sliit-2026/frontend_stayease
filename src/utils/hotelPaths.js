export const HOTEL_SERVICE_BASE = '/hotel-service';
export const HOTEL_ADMIN_BASE = '/hotel-admin';

export const hotelServicePaths = {
  home: HOTEL_SERVICE_BASE,
  hotelDetails: (id = ':id') => `${HOTEL_SERVICE_BASE}/hotels/${id}`,
  admin: HOTEL_ADMIN_BASE,
  adminHotelDetails: (id = ':id') => `${HOTEL_ADMIN_BASE}/hotels/${id}`,
};