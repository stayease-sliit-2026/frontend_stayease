import axios from 'axios'

const BASE_URL =
  import.meta.env.VITE_HOTEL_SERVICE_URL ||
  import.meta.env.VITE_API_GATEWAY_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3002'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

function getAuthToken() {
  return (
    sessionStorage.getItem('adminAuthToken') ||
    sessionStorage.getItem('authToken') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('adminAuthToken') ||
    localStorage.getItem('token') ||
    ''
  ).trim()
}

function getAdminAuthHeaders() {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Missing or invalid Authorization header')
  }
  return {
    Authorization: `Bearer ${token}`,
  }
}

// Attach stored JWT token to every request when available
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function getErrorMessage(error) {
  return error?.response?.data?.message || error.message || 'Request failed'
}

export async function listHotels(params = {}) {
  try {
    const response = await api.get('/hotels', { params })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getHotelById(hotelId) {
  try {
    const response = await api.get(`/hotels/${hotelId}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function listHotelRooms(hotelId) {
  try {
    const response = await api.get(`/hotels/${hotelId}/rooms`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createHotel(payload) {
  try {
    const headers = getAdminAuthHeaders();
    console.log('Admin createHotel: token', headers.Authorization);
    const response = await api.post('/hotels', payload, {
      headers,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateHotel(hotelId, payload) {
  try {
    const headers = getAdminAuthHeaders();
    console.log('Admin updateHotel: token', headers.Authorization);
    const response = await api.put(`/hotels/${hotelId}`, payload, {
      headers,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteHotel(hotelId) {
  try {
    const headers = getAdminAuthHeaders();
    console.log('Admin deleteHotel: token', headers.Authorization);
    const response = await api.delete(`/hotels/${hotelId}`, {
      headers,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function addRoomToHotel(hotelId, payload) {
  try {
    const headers = getAdminAuthHeaders();
    console.log('Admin addRoomToHotel: token', headers.Authorization);
    const response = await api.post(`/hotels/${hotelId}/rooms`, payload, {
      headers,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateRoom(hotelId, roomId, payload) {
  try {
    const headers = getAdminAuthHeaders();
    console.log('Admin updateRoom: token', headers.Authorization);
    const response = await api.put(`/hotels/${hotelId}/rooms/${roomId}`, payload, {
      headers,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteRoom(hotelId, roomId) {
  try {
    const headers = getAdminAuthHeaders();
    console.log('Admin deleteRoom: token', headers.Authorization);
    const response = await api.delete(`/hotels/${hotelId}/rooms/${roomId}`, {
      headers,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export { BASE_URL }
