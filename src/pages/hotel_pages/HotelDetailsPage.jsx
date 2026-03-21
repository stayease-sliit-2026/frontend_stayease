import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiCheckCircle, FiEye, FiMapPin, FiSearch, FiStar, FiUsers, FiX } from 'react-icons/fi'
import { TbCurrencyDollar } from 'react-icons/tb'
import { getHotelById, listHotelRooms } from '../../services/hotelApi'
import BackButton from '../../components/hotel_components/BackButton'

function HotelDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [selectedGalleryImage, setSelectedGalleryImage] = useState('')
  const [roomSearch, setRoomSearch] = useState('')
  const [guestFilter, setGuestFilter] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const filteredRooms = useMemo(() => {
    const search = roomSearch.trim().toLowerCase()
    const requestedGuests = Number(guestFilter)

    return rooms.filter((room) => {
      const typeMatch = !search || (room.type || '').toLowerCase().includes(search)
      const guestsMatch = !guestFilter || (Number.isFinite(requestedGuests) && (room.capacity || 0) >= requestedGuests)

      return typeMatch && guestsMatch
    })
  }, [guestFilter, roomSearch, rooms])

  function getUserFriendlyError(message) {
    if (!message) return 'Something went wrong while loading this hotel.'

    const text = message.toLowerCase()
    if (text.includes('network') || text.includes('failed to fetch') || text.includes('unable to connect')) {
      return 'We could not connect to the hotel service right now. Please try again shortly.'
    }

    return message
  }

  function resetRoomFilters() {
    setRoomSearch('')
    setGuestFilter('')
  }

  function openBookingCreate(room) {
    const params = new URLSearchParams({
      hotelId: id,
      roomId: room._id,
      roomType: room.type || '',
      pricePerNight: String(room.price || ''),
    })

    navigate(`/booking-service/create?${params.toString()}`, {
      state: {
        hotelId: id,
        roomId: room._id,
        roomType: room.type || '',
        roomPrice: room.price || '',
      },
    })
  }

  useEffect(() => {
    async function loadHotelData() {
      try {
        setLoading(true)
        setError('')

        const [hotelData, roomData] = await Promise.all([
          getHotelById(id),
          listHotelRooms(id),
        ])

        setHotel(hotelData)
        setRooms(roomData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadHotelData()
  }, [id])

  useEffect(() => {
    setSelectedGalleryImage(hotel?.images?.[0] || '')
  }, [hotel])

  if (loading) {
    return (
      <section className="min-h-screen bg-sky-100/80">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-slate-600">
          <BackButton />
          <p className="mt-4">Loading hotel details...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen bg-sky-100/80">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-rose-600">
          <BackButton />
          <p className="mt-4">{getUserFriendlyError(error)}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium hover:bg-rose-100"
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  if (!hotel) {
    return (
      <section className="min-h-screen bg-sky-100/80">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-slate-600">
          <BackButton />
          <p className="mt-4">Hotel not found.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-sky-100/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <BackButton />

      <div className="mt-4 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-lg shadow-sky-200/70 md:p-5 lg:sticky lg:top-24">
          <h1 className="text-xl font-bold text-[#0a2342] md:text-2xl">{hotel.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
            <FiMapPin size={14} />
            {hotel.location}
          </p>

          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-lg bg-sky-100 px-3 py-2 text-[#0a2342]">
              <FiStar size={14} className="mr-1 inline text-amber-500" />
              Rating: <span className="font-semibold">{hotel.rating ?? 0}</span>
            </div>
            <div className="rounded-lg bg-sky-100 px-3 py-2 text-[#1e3a5c]">
              Rooms: <span className="font-semibold">{rooms.length}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-sky-100/70 p-3">
            <h2 className="mb-1 text-sm font-semibold text-[#0a2342]">About This Hotel</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {hotel.description || 'No description available.'}
            </p>
          </div>

          <div className="mt-4">
            <h2 className="mb-2 text-sm font-semibold text-[#0a2342]">Filter Rooms</h2>
            <div className="space-y-3">
              <label className="relative block">
                <FiSearch
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4fd1c5]"
                />
                <input
                  value={roomSearch}
                  onChange={(event) => setRoomSearch(event.target.value)}
                  placeholder="Search room type"
                  className="w-full rounded-lg border border-sky-300 bg-sky-50 py-2.5 pl-9 pr-3 text-sm focus:border-[#1e3a5c] focus:outline-none"
                />
              </label>

              <label className="relative block">
                <FiUsers
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4fd1c5]"
                />
                <input
                  value={guestFilter}
                  onChange={(event) => setGuestFilter(event.target.value)}
                  type="number"
                  min="1"
                  placeholder="Guests"
                  className="w-full rounded-lg border border-sky-300 bg-sky-50 py-2.5 pl-9 pr-3 text-sm focus:border-[#1e3a5c] focus:outline-none"
                />
              </label>

              {(roomSearch.trim() || guestFilter) && (
                <button
                  type="button"
                  onClick={resetRoomFilters}
                  className="w-full rounded-md border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-medium text-[#0a2342] hover:bg-sky-100"
                >
                  Clear room filters
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="mb-2 text-sm font-semibold text-[#0a2342]">Amenities</h2>
            {hotel.amenities?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-sky-100 px-2.5 py-1 text-xs text-slate-700"
                  >
                    <FiCheckCircle size={12} className="text-[#0a2342]" />
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-sky-100 px-3 py-3 text-sm text-slate-600">
                No amenities listed for this hotel.
              </div>
            )}
          </div>
        </aside>

        <div>
          <div className="overflow-hidden rounded-3xl border border-sky-200 bg-sky-50 shadow-xl shadow-sky-200/70">
            <div className="relative h-64 md:h-80">
              {hotel.images?.[0] ? (
                <img src={selectedGalleryImage || hotel.images[0]} alt={hotel.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-[#0a2342] to-[#27476b]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#0a2342]/80 via-[#1e3a5c]/30 to-transparent" />
            </div>

            {hotel.images?.length > 0 && (
              <div className="border-t border-sky-200 bg-sky-100/60 p-4">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                  {hotel.images.map((image, index) => {
                    const isActive = (selectedGalleryImage || hotel.images[0]) === image

                    return (
                      <button
                        key={`${image.slice(0, 20)}-${index}`}
                        type="button"
                        onClick={() => setSelectedGalleryImage(image)}
                        className={`overflow-hidden rounded-lg border-2 ${
                          isActive ? 'border-[#0a2342]' : 'border-transparent'
                        }`}
                        title={`View photo ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${hotel.name} ${index + 1}`}
                          className="h-16 w-full object-cover"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mb-4 mt-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#0a2342]">Availability</h2>
            <p className="text-sm text-slate-500">
              Showing {filteredRooms.length} of {rooms.length}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-sky-200 bg-sky-50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#0a2342] text-left text-xs font-semibold uppercase tracking-wide text-white">
                    <th className="px-4 py-3">Room Type</th>
                    <th className="px-4 py-3">Guests</th>
                    <th className="px-4 py-3">Price / night</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room, index) => (
                    <tr
                      key={room._id}
                      className={`border-t border-sky-200 ${index % 2 === 0 ? 'bg-sky-50' : 'bg-sky-100/50'} hover:bg-sky-100`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRoom(room)}
                          className="font-semibold text-[#0071c2] underline-offset-2 hover:underline"
                        >
                          {room.type}
                        </button>
                        <p className="mt-1 max-w-md line-clamp-3 text-xs leading-relaxed text-slate-500">
                          {room.description || 'No room description available'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <span className="inline-flex items-center gap-1.5">
                          <FiUsers size={14} className="text-[#0a2342]" />
                          {room.capacity} guests
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="inline-flex items-center gap-1 text-lg font-bold text-slate-900">
                          <TbCurrencyDollar size={18} className="text-[#0a2342]" />
                          {room.price}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            room.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                          }`}
                        >
                          {room.isAvailable ? 'Available' : 'Sold out'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openBookingCreate(room)}
                          className="inline-flex items-center justify-center rounded-md bg-[#0071c2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005999]"
                        >
                          Reserve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rooms.length === 0 && (
              <div className="border-t border-sky-200 p-8 text-center text-sm text-slate-600">
                No rooms available for this hotel.
              </div>
            )}

            {rooms.length > 0 && filteredRooms.length === 0 && (
              <div className="border-t border-sky-200 p-8 text-center text-sm text-slate-600">
                <p>No rooms found for your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {selectedRoom && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center bg-slate-900/50 p-4 pt-24 md:items-center md:pt-6"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[#e8edf5] bg-[#f7fbff] px-6 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#0a2342]">{selectedRoom.type}</h3>
                  <p className="mt-1 text-sm text-slate-600">Detailed room information</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close room details"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(88vh-76px)] space-y-5 overflow-y-auto p-6">
              {selectedRoom.images?.[0] && (
                <img
                  src={selectedRoom.images[0]}
                  alt={`${selectedRoom.type} main`}
                  className="h-56 w-full rounded-xl object-cover"
                />
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-[#e8edf5] bg-[#f9fbff] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Price</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">${selectedRoom.price} / night</p>
                </div>
                <div className="rounded-lg border border-[#e8edf5] bg-[#f9fbff] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Capacity</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{selectedRoom.capacity} guests</p>
                </div>
                <div className="rounded-lg border border-[#e8edf5] bg-[#f9fbff] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
                  <p className={`mt-1 text-base font-semibold ${selectedRoom.isAvailable ? 'text-green-700' : 'text-slate-600'}`}>
                    {selectedRoom.isAvailable ? 'Available now' : 'Sold out'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  {selectedRoom.description || 'No room description available.'}
                </p>
              </div>

              {selectedRoom.images?.length > 1 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">More photos</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {selectedRoom.images.slice(1).map((image, index) => (
                      <img
                        key={`${image.slice(0, 24)}-${index}`}
                        src={image}
                        alt={`${selectedRoom.type} ${index + 2}`}
                        className="h-20 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => openBookingCreate(selectedRoom)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#0071c2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005999]"
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HotelDetailsPage
