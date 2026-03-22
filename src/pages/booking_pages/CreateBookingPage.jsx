import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiLoader, FiUsers } from 'react-icons/fi'
import { bookingPaths } from '../../utils/bookingPaths'
import { checkRoomAvailability, createBooking, hasBookingToken } from '../../services/bookingApi'
import useHotelService from '../../hooks/useHotelService'
import BackButton from '../../components/hotel_components/BackButton'

const BRAND = {
  dark: '#334eac',
  medium: '#7096d1',
  light: '#bad6eb',
}

function getLocalDatetimeMin() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function toDatetimeLocalValue(value) {
  if (!value) return ''
  // Keep native datetime-local values unchanged to avoid timezone drift.
  if (typeof value === 'string' && value.includes('T') && value.length >= 16) {
    return value.slice(0, 16)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function toIsoOrEmpty(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString()
}

function normalizeAvailabilityPayload(payload) {
  if (!payload) return null
  if (typeof payload === 'object' && payload.data && typeof payload.data === 'object') {
    return payload.data
  }
  if (typeof payload === 'object') {
    return payload
  }
  return null
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0

  const start = new Date(checkIn)
  const end = new Date(checkOut)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0

  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

function validateBookingDates(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return { valid: false, message: 'Select both check-in and check-out dates.' }
  }

  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const now = new Date()

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { valid: false, message: 'Please provide valid date and time values.' }
  }

  if (start < now) {
    return { valid: false, message: 'Check-in cannot be in the past.' }
  }

  if (end <= start) {
    return { valid: false, message: 'Check-out must be after check-in.' }
  }

  return { valid: true, message: '' }
}

function getReadableAvailabilityError(error) {
  if (!error) return 'Unable to check availability'

  const details = error?.raw?.details
  if (typeof details === 'string' && details.toLowerCase().includes('enotfound')) {
    return 'Booking service cannot reach hotel service right now. Please try again later.'
  }

  return error?.message || 'Unable to check availability'
}

function CreateBookingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getHotelById, listHotelRooms } = useHotelService()

  const isAuthed = hasBookingToken()
  const stateHotelId = location.state?.hotelId || ''
  const stateRoomId = location.state?.roomId || ''
  const stateRoomType = location.state?.roomType || ''
  const stateRoomPrice = location.state?.roomPrice || ''

  const [form, setForm] = useState({
    hotelId: searchParams.get('hotelId') || stateHotelId,
    roomId: searchParams.get('roomId') || stateRoomId,
    checkIn: '',
    checkOut: '',
    numberOfGuests: 1,
    totalPrice: '',
    roomType: searchParams.get('roomType') || stateRoomType,
    specialRequests: '',
    pricePerNight: searchParams.get('pricePerNight') || stateRoomPrice || '',
  })

  const [availability, setAvailability] = useState(null)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hotelName, setHotelName] = useState('')
  const [roomDisplayName, setRoomDisplayName] = useState('')
  const minDatetimeLocal = useMemo(() => getLocalDatetimeMin(), [])

  const nights = useMemo(() => calculateNights(form.checkIn, form.checkOut), [form.checkIn, form.checkOut])
  const dateValidation = useMemo(
    () => validateBookingDates(form.checkIn, form.checkOut),
    [form.checkIn, form.checkOut],
  )
  const calculatedTotal = useMemo(() => {
    const nightly = Number(form.pricePerNight)
    if (!Number.isFinite(nightly) || nightly <= 0 || nights <= 0) return ''
    return (nightly * nights).toFixed(2)
  }, [form.pricePerNight, nights])

  const canCreateBooking =
    !submitting &&
    isAuthed &&
    Boolean(form.hotelId) &&
    Boolean(form.roomId) &&
    dateValidation.valid &&
    Number(form.totalPrice) > 0 &&
    availabilityChecked &&
    Boolean(availability?.available)

  useEffect(() => {
    setForm((prev) => {
      const nextTotal = calculatedTotal || ''
      if (prev.totalPrice === nextTotal) return prev
      return { ...prev, totalPrice: nextTotal }
    })
  }, [calculatedTotal])

  useEffect(() => {
    setAvailability(null)
    setAvailabilityChecked(false)
  }, [form.hotelId, form.roomId, form.checkIn, form.checkOut])

  useEffect(() => {
    async function resolveReadableNames() {
      if (!form.hotelId) {
        setHotelName('')
        setRoomDisplayName('')
        return
      }

      try {
        const [hotel, rooms] = await Promise.all([
          getHotelById(form.hotelId),
          listHotelRooms(form.hotelId),
        ])

        setHotelName(hotel?.name || '')

        const selectedRoom = Array.isArray(rooms)
          ? rooms.find((room) => room?._id === form.roomId)
          : null

        if (selectedRoom) {
          const readable = selectedRoom.type
            ? `${selectedRoom.type}${selectedRoom.capacity ? ` (${selectedRoom.capacity} guests)` : ''}`
            : selectedRoom._id

          setRoomDisplayName(readable || '')

          // Keep booking form metadata in sync with the selected room details.
          setForm((prev) => ({
            ...prev,
            roomType: prev.roomType || selectedRoom.type || '',
            pricePerNight: prev.pricePerNight || selectedRoom.price || '',
          }))
        } else {
          setRoomDisplayName('')
        }
      } catch {
        // Do not block booking creation if labels cannot be fetched.
        setHotelName('')
        setRoomDisplayName('')
      }
    }

    resolveReadableNames()
  }, [form.hotelId, form.roomId, getHotelById, listHotelRooms])

  async function handleCheckAvailability() {
    if (!form.hotelId || !form.roomId) {
      setError('Hotel and room are required to check availability.')
      return
    }

    if (!dateValidation.valid) {
      setError(dateValidation.message)
      return
    }

    try {
      setError('')
      setAvailability(null)
      setCheckingAvailability(true)

      const data = await checkRoomAvailability({
        hotelId: form.hotelId,
        roomId: form.roomId,
        checkIn: toIsoOrEmpty(form.checkIn),
        checkOut: toIsoOrEmpty(form.checkOut),
      })

      const availabilityPayload = normalizeAvailabilityPayload(data)
      setAvailability(availabilityPayload)
      setAvailabilityChecked(true)

      if (availabilityPayload?.pricePerNight) {
        const nightly = Number(availabilityPayload.pricePerNight)
        const total = nights > 0 ? (nightly * nights).toFixed(2) : ''

        setForm((prev) => ({
          ...prev,
          pricePerNight: nightly,
          totalPrice: total || prev.totalPrice,
        }))
      }
    } catch (err) {
      setAvailabilityChecked(false)
      setError(getReadableAvailabilityError(err))
    } finally {
      setCheckingAvailability(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isAuthed) {
      setError('Please login before creating a booking.')
      return
    }

    if (!form.hotelId || !form.roomId || !form.totalPrice) {
      setError('Please complete all required fields.')
      return
    }

    if (!dateValidation.valid) {
      setError(dateValidation.message)
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const payload = {
        hotelId: form.hotelId,
        roomId: form.roomId,
        checkIn: toIsoOrEmpty(form.checkIn),
        checkOut: toIsoOrEmpty(form.checkOut),
        numberOfGuests: Number(form.numberOfGuests) || 1,
        totalPrice: Number(form.totalPrice),
        roomType: form.roomType || undefined,
        specialRequests: form.specialRequests || undefined,
      }

      const response = await createBooking(payload)
      const bookingData = response?.data && typeof response.data === 'object' ? response.data : response
      const bookingId = bookingData?._id

      setSuccess(response?.message || 'Booking created successfully')

      if (bookingId) {
        setTimeout(() => {
          navigate(bookingPaths.details(bookingId), { replace: true })
        }, 700)
      }
    } catch (err) {
      setError(err?.message || 'Unable to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <BackButton fallbackPath={bookingPaths.home} label="Back to booking dashboard" />
          <Link
            to={bookingPaths.list}
            className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            style={{ borderColor: BRAND.light }}
          >
            View My Bookings
          </Link>
        </div>

        <div
          className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"
          style={{ borderColor: BRAND.light }}
        >
          <h1 className="text-2xl font-bold" style={{ color: BRAND.dark }}>Create booking</h1>
          <p className="mt-1 text-sm text-slate-600">
            Fill your stay details, validate room availability, and create a pending booking.
          </p>

          {!isAuthed && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              You are not logged in. Go to login page and come back with your token.
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <FiAlertCircle className="mt-0.5" size={15} />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <FiCheckCircle className="mt-0.5" size={15} />
              {success}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {/* READ-ONLY SECTION: Hotel, Room, Price Info */}
            <div className="rounded-xl border-2 bg-slate-50 p-4" style={{ borderColor: BRAND.light }}>
              <p className="mb-3 text-sm font-semibold text-slate-600">Room Information (From Hotel Service)</p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Hotel Name</span>
                  <input
                    className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={hotelName || '-'}
                    disabled
                    placeholder="GrandBella"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Room</span>
                  <input
                    className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={roomDisplayName || form.roomType || '-'}
                    disabled
                    placeholder="Double (2 guests)"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Hotel ID</span>
                  <input
                    className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={form.hotelId}
                    disabled
                    placeholder="hotel123"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Room ID</span>
                  <input
                    className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={form.roomId}
                    disabled
                    placeholder="room456"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Room Type</span>
                  <input
                    className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={form.roomType || roomDisplayName}
                    disabled
                    placeholder="Deluxe"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Price per Night</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={form.pricePerNight}
                    disabled
                    placeholder="100"
                  />
                </label>
              </div>
            </div>

            {/* EDITABLE SECTION: Booking Details */}
            <div className="rounded-xl border-2 bg-white p-4" style={{ borderColor: BRAND.medium }}>
              <p className="mb-3 text-sm font-semibold text-slate-600">Your Stay Details (Edit Below)</p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 flex items-center gap-2 font-medium text-slate-700"><FiCalendar size={14} /> Check-in</span>
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={toDatetimeLocalValue(form.checkIn)}
                    min={minDatetimeLocal}
                    onChange={(event) => setForm((prev) => ({ ...prev, checkIn: event.target.value }))}
                    required
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 flex items-center gap-2 font-medium text-slate-700"><FiCalendar size={14} /> Check-out</span>
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={toDatetimeLocalValue(form.checkOut)}
                    min={toDatetimeLocalValue(form.checkIn) || minDatetimeLocal}
                    onChange={(event) => setForm((prev) => ({ ...prev, checkOut: event.target.value }))}
                    required
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 flex items-center gap-2 font-medium text-slate-700"><FiUsers size={14} /> Number of Adults</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: BRAND.light }}
                    value={form.numberOfGuests}
                    onChange={(event) => setForm((prev) => ({ ...prev, numberOfGuests: event.target.value }))}
                    required
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Total Price</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="flex-1 rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed focus:outline-none"
                      style={{ borderColor: BRAND.light }}
                      value={form.totalPrice}
                      disabled
                      placeholder="500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'} × $${Number(form.pricePerNight || 0).toFixed(2)} = $${form.totalPrice}` : 'Select dates to calculate'}
                  </p>
                </label>
              </div>
            </div>

            {/* OPTIONAL REQUESTS */}
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Special Requests (optional)</span>
              <textarea
                className="min-h-20 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: BRAND.light }}
                value={form.specialRequests}
                onChange={(event) => setForm((prev) => ({ ...prev, specialRequests: event.target.value }))}
                placeholder="High floor, late check-in, quiet room..."
              />
            </label>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCheckAvailability}
                disabled={checkingAvailability || !form.hotelId || !form.roomId || !dateValidation.valid}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND.medium }}
              >
                {checkingAvailability ? <FiLoader className="animate-spin" size={14} /> : null}
                Check Availability
              </button>

              <button
                type="submit"
                disabled={!canCreateBooking}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND.dark }}
              >
                {submitting ? <FiLoader className="animate-spin" size={14} /> : null}
                Create Booking
              </button>
            </div>

            {!dateValidation.valid && (
              <p className="text-xs text-amber-700">{dateValidation.message}</p>
            )}

            {dateValidation.valid && !availabilityChecked && (
              <p className="text-xs text-slate-500">Check availability first to enable Create Booking.</p>
            )}

            {availabilityChecked && availability && !availability.available && (
              <p className="text-xs text-rose-700">Selected room is not available for these dates. Please change dates and re-check.</p>
            )}

            {availability && (
              <div
                className={`rounded-xl border px-3 py-2 text-sm ${availability.available ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}
              >
                {availability.available
                  ? `✓ Room is available.${availability.pricePerNight ? ` Price per night: $${availability.pricePerNight}` : ''}`
                  : '✗ Room is not available for selected dates.'}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default CreateBookingPage
