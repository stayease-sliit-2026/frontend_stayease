import axios from 'axios'

const BOOKING_BASE_URL =
  // import.meta.env.VITE_BOOKING_SERVICE_BASE_URL ||
  // import.meta.env.VITE_API_BASE_URL ||
  // 'http://localhost:3003'
 "https://stayease-booking.ambitiousforest-4a1ef578.southeastasia.azurecontainerapps.io"

const bookingApi = axios.create({
  baseURL: BOOKING_BASE_URL,
  timeout: 12000,
})

function getAuthToken() {
  return (
    sessionStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    ''
  )
}

bookingApi.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function normalizeError(error) {
  const status = error?.response?.status
  const payload = error?.response?.data
  const message =
    payload?.message ||
    payload?.details?.[0]?.msg ||
    error?.message ||
    'Something went wrong'

  const details = Array.isArray(payload?.details)
    ? payload.details.map((item) => item?.msg || item?.message).filter(Boolean)
    : []

  return {
    status,
    message,
    details,
    raw: payload,
  }
}

function toISOStringIfPresent(value) {
  if (!value) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString()
}

export async function getBookingServiceInfo() {
  try {
    const response = await bookingApi.get('/')
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function getBookingHealth() {
  try {
    const response = await bookingApi.get('/health')
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function checkRoomAvailability({ hotelId, roomId, checkIn, checkOut }) {
  try {
    const response = await bookingApi.get('/bookings/availability', {
      params: {
        hotelId,
        roomId,
        checkIn: toISOStringIfPresent(checkIn),
        checkOut: toISOStringIfPresent(checkOut),
      },
    })
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function createBooking(payload) {
  try {
    const response = await bookingApi.post('/bookings', {
      ...payload,
      checkIn: toISOStringIfPresent(payload?.checkIn),
      checkOut: toISOStringIfPresent(payload?.checkOut),
    })
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function getBookingById(bookingId) {
  try {
    const response = await bookingApi.get(`/bookings/${bookingId}`)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

console.log('Booking full URL:', BOOKING_BASE_URL)
export async function getUserBookings(params = {}) {
  try {
    const requestUrl = bookingApi.getUri({
      url: '/bookings/user/',
      params,
    })
    console.log('getUserBookings ->', requestUrl)

    const response = await bookingApi.get('/bookings/user/', { params })
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function confirmBooking(bookingId) {
  try {
    const response = await bookingApi.put(`/bookings/${bookingId}/confirm`)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function cancelBooking(bookingId, reason) {
  try {
    const payload = reason ? { reason } : undefined
    const response = await bookingApi.put(`/bookings/${bookingId}/cancel`, payload)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function getUserBookingStats() {
  try {
    const response = await bookingApi.get('/bookings/user/stats')
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export function hasBookingToken() {
  return Boolean(getAuthToken())
}

export { BOOKING_BASE_URL }
