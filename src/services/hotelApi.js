import axios from 'axios'

const BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000'

// Frontend-only flow toggle.
// Set VITE_HOTEL_USE_MOCK=false when backend/API Gateway is ready.
const USE_MOCK = String(import.meta.env.VITE_HOTEL_USE_MOCK ?? 'true').toLowerCase() !== 'false'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Attach stored JWT token to every request when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function getErrorMessage(error) {
  return error?.response?.data?.message || error.message || 'Request failed'
}

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function withDelay(data, ms = 120) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(clone(data)), ms)
  })
}

function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

const mockState = {
  hotels: [
    {
      _id: 'h_ella_1',
      name: 'Skyline Ella Retreat',
      location: 'Ella',
      description: 'A mountain-view boutique hotel with modern comfort and quick access to Little Adams Peak.',
      rating: 4.6,
      images: [],
      amenities: ['Wi-Fi', 'Breakfast', 'Parking'],
    },
    {
      _id: 'h_colombo_1',
      name: 'Ocean Crest Colombo',
      location: 'Colombo',
      description: 'City-center stay with rooftop dining and comfortable rooms for business and leisure.',
      rating: 4.3,
      images: [],
      amenities: ['Pool', 'Wi-Fi', 'Gym'],
    },
  ],
  roomsByHotelId: {
    h_ella_1: [
      {
        _id: 'r_ella_1',
        type: 'Deluxe Double Room',
        price: 120,
        capacity: 2,
        description: 'Balcony view to tea hills with king bed.',
        images: [],
        isAvailable: true,
      },
      {
        _id: 'r_ella_2',
        type: 'Family Suite',
        price: 185,
        capacity: 4,
        description: 'Spacious suite for family stays.',
        images: [],
        isAvailable: false,
      },
    ],
    h_colombo_1: [
      {
        _id: 'r_col_1',
        type: 'Standard Twin',
        price: 95,
        capacity: 2,
        description: 'Comfortable city room with twin beds.',
        images: [],
        isAvailable: true,
      },
    ],
  },
}

function getRoomsBucket(hotelId) {
  if (!mockState.roomsByHotelId[hotelId]) {
    mockState.roomsByHotelId[hotelId] = []
  }
  return mockState.roomsByHotelId[hotelId]
}

function findHotelIndex(hotelId) {
  return mockState.hotels.findIndex((hotel) => hotel._id === hotelId)
}

export async function listHotels(params = {}) {
  if (USE_MOCK) {
    const q = String(params.q || '').toLowerCase().trim()
    const location = String(params.location || '').toLowerCase().trim()
    const minRating = params.minRating === undefined ? null : Number(params.minRating)

    const filtered = mockState.hotels.filter((hotel) => {
      const matchesQ = !q || hotel.name.toLowerCase().includes(q)
      const matchesLocation = !location || hotel.location.toLowerCase().includes(location)
      const matchesMinRating = minRating === null || Number(hotel.rating || 0) >= minRating
      return matchesQ && matchesLocation && matchesMinRating
    })

    return withDelay(filtered)
  }

  try {
    const response = await api.get('/hotels', { params })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getHotelById(hotelId) {
  if (USE_MOCK) {
    const hotel = mockState.hotels.find((item) => item._id === hotelId)
    if (!hotel) {
      throw new Error('Hotel not found')
    }
    return withDelay(hotel)
  }

  try {
    const response = await api.get(`/hotels/${hotelId}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function listHotelRooms(hotelId) {
  if (USE_MOCK) {
    const rooms = getRoomsBucket(hotelId)
    return withDelay(rooms)
  }

  try {
    const response = await api.get(`/hotels/${hotelId}/rooms`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createHotel(payload) {
  if (USE_MOCK) {
    const nextHotel = {
      _id: makeId('h'),
      name: String(payload.name || '').trim(),
      location: String(payload.location || '').trim(),
      description: String(payload.description || '').trim(),
      rating: Number(payload.rating ?? 0),
      images: Array.isArray(payload.images) ? payload.images : [],
      amenities: Array.isArray(payload.amenities) ? payload.amenities : [],
    }
    mockState.hotels.push(nextHotel)
    return withDelay(nextHotel)
  }

  try {
    const response = await api.post('/hotels', payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateHotel(hotelId, payload) {
  if (USE_MOCK) {
    const idx = findHotelIndex(hotelId)
    if (idx < 0) {
      throw new Error('Hotel not found')
    }

    const current = mockState.hotels[idx]
    const updated = {
      ...current,
      ...payload,
      _id: current._id,
      rating: payload.rating !== undefined ? Number(payload.rating) : current.rating,
      amenities: Array.isArray(payload.amenities) ? payload.amenities : current.amenities,
      images: Array.isArray(payload.images) ? payload.images : current.images,
    }

    mockState.hotels[idx] = updated
    return withDelay(updated)
  }

  try {
    const response = await api.put(`/hotels/${hotelId}`, payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteHotel(hotelId) {
  if (USE_MOCK) {
    const idx = findHotelIndex(hotelId)
    if (idx < 0) {
      throw new Error('Hotel not found')
    }

    mockState.hotels.splice(idx, 1)
    delete mockState.roomsByHotelId[hotelId]
    return withDelay({ success: true })
  }

  try {
    const response = await api.delete(`/hotels/${hotelId}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function addRoomToHotel(hotelId, payload) {
  if (USE_MOCK) {
    const hotelExists = findHotelIndex(hotelId) >= 0
    if (!hotelExists) {
      throw new Error('Hotel not found')
    }

    const room = {
      _id: makeId('r'),
      type: String(payload.type || '').trim(),
      price: Number(payload.price ?? 0),
      capacity: Number(payload.capacity ?? 1),
      description: String(payload.description || '').trim(),
      images: Array.isArray(payload.images) ? payload.images : [],
      isAvailable: payload.isAvailable !== false,
    }

    getRoomsBucket(hotelId).push(room)
    return withDelay(room)
  }

  try {
    const response = await api.post(`/hotels/${hotelId}/rooms`, payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateRoom(hotelId, roomId, payload) {
  if (USE_MOCK) {
    const rooms = getRoomsBucket(hotelId)
    const idx = rooms.findIndex((room) => room._id === roomId)
    if (idx < 0) {
      throw new Error('Room not found')
    }

    const updated = {
      ...rooms[idx],
      ...payload,
      _id: rooms[idx]._id,
      price: payload.price !== undefined ? Number(payload.price) : rooms[idx].price,
      capacity: payload.capacity !== undefined ? Number(payload.capacity) : rooms[idx].capacity,
      images: Array.isArray(payload.images) ? payload.images : rooms[idx].images,
    }

    rooms[idx] = updated
    return withDelay(updated)
  }

  try {
    const response = await api.put(`/hotels/${hotelId}/rooms/${roomId}`, payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteRoom(hotelId, roomId) {
  if (USE_MOCK) {
    const rooms = getRoomsBucket(hotelId)
    const idx = rooms.findIndex((room) => room._id === roomId)
    if (idx < 0) {
      throw new Error('Room not found')
    }

    rooms.splice(idx, 1)
    return withDelay({ success: true })
  }

  try {
    const response = await api.delete(`/hotels/${hotelId}/rooms/${roomId}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export { BASE_URL, USE_MOCK }
