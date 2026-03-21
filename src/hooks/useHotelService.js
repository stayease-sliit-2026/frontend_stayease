import { useMemo } from 'react'
import {
  addRoomToHotel,
  createHotel,
  deleteHotel,
  deleteRoom,
  getHotelById,
  listHotelRooms,
  listHotels,
  updateHotel,
  updateRoom,
} from '../services/hotelApi'

export default function useHotelService() {
  return useMemo(
    () => ({
      listHotels,
      getHotelById,
      listHotelRooms,
      createHotel,
      updateHotel,
      deleteHotel,
      addRoomToHotel,
      updateRoom,
      deleteRoom,
    }),
    [],
  )
}
