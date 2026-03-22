import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiClock, FiLoader, FiMapPin, FiXCircle } from 'react-icons/fi'
import { bookingPaths } from '../../utils/bookingPaths'
import { cancelBooking, getBookingById, hasBookingToken } from '../../services/bookingApi'
import BackButton from '../../components/hotel_components/BackButton'

const BRAND = {
  dark: '#334eac',
  medium: '#7096d1',
  light: '#bad6eb',
}

function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase()

  if (normalized === 'confirmed') {
    return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Confirmed</span>
  }

  if (normalized === 'cancelled') {
    return <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">Cancelled</span>
  }

  return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">Pending</span>
}

function BookingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isAuthed = hasBookingToken()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  useEffect(() => {
    async function loadBooking() {
      if (!isAuthed) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const response = await getBookingById(id)
        setBooking(response?.data || null)
      } catch (err) {
        setError(err?.message || 'Unable to fetch booking details')
      } finally {
        setLoading(false)
      }
    }

    loadBooking()
  }, [id, isAuthed])

  useEffect(() => {
    if (searchParams.get('paymentSuccess') !== '1') {
      return
    }

    setSuccess('Payment completed and booking confirmed successfully.')

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('paymentSuccess')
    setSearchParams(nextParams, { replace: true })

    const timer = setTimeout(() => {
      setSuccess('')
    }, 3500)

    return () => clearTimeout(timer)
  }, [searchParams, setSearchParams])

  async function refreshBooking() {
    try {
      setLoading(true)
      const response = await getBookingById(id)
      setBooking(response?.data || null)
      setError('')
    } catch (err) {
      setError(err?.message || 'Unable to refresh booking details')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm() {
    try {
      setActionLoading('confirm')
      setError('')

      const query = new URLSearchParams({
        flow: 'booking-confirm',
        bookingId: id,
        amount: String(booking?.totalPrice || ''),
        currency: 'USD',
        returnTo: bookingPaths.details(id),
      })

      navigate(`/payments?${query.toString()}`)
    } catch (err) {
      setError(err?.message || 'Unable to confirm booking. Payment may have failed.')
    } finally {
      setActionLoading('')
    }
  }

  async function handleCancel() {
    const reason = window.prompt('Optional: cancellation reason') || ''

    try {
      setActionLoading('cancel')
      setError('')
      
      // Step 1: Cancel the booking
      const cancelResponse = await cancelBooking(id, reason)
      
      // Step 2: Mark room as available again in hotel service
      // await markRoomAvailable(booking.hotelId, booking.roomId, {
      //   checkIn: booking.checkIn,
      //   checkOut: booking.checkOut,
      //   bookingId: id
      // })
      
      setSuccess(cancelResponse?.message || 'Booking cancelled successfully. Room is now available again.')
      await refreshBooking()
      
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err?.message || 'Unable to cancel booking')
    } finally {
      setActionLoading('')
    }
  }

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <BackButton fallbackPath={bookingPaths.list} label="Back to bookings" />
          <Link
            to={bookingPaths.list}
            className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            style={{ borderColor: BRAND.light }}
          >
            My Bookings
          </Link>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6" style={{ borderColor: BRAND.light }}>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.dark }}>Booking details</h1>
          <p className="mt-1 text-sm text-slate-600">Booking ID: {id}</p>

          {!isAuthed && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              You need a valid login token to access this booking.
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

          {loading && (
            <p className="mt-4 text-sm text-slate-500">Loading booking information...</p>
          )}

          {!loading && booking && (
            <div className="mt-5 space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <article className="rounded-xl border bg-slate-50 px-4 py-3" style={{ borderColor: BRAND.light }}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                  <div className="mt-2"><StatusBadge status={booking.status} /></div>
                </article>
                <article className="rounded-xl border bg-slate-50 px-4 py-3" style={{ borderColor: BRAND.light }}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{booking.paymentStatus || 'pending'}</p>
                </article>
                <article className="rounded-xl border bg-slate-50 px-4 py-3" style={{ borderColor: BRAND.light }}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total price</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">${Number(booking.totalPrice || 0).toFixed(2)}</p>
                </article>
              </div>

              <div className="grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-2" style={{ borderColor: BRAND.light }}>
                <div className="space-y-2 text-sm text-slate-700">
                  <p className="flex items-start gap-2"><FiMapPin className="mt-0.5" size={14} /> Hotel: {booking.hotelId}</p>
                  <p className="flex items-start gap-2"><FiMapPin className="mt-0.5" size={14} /> Room: {booking.roomId}</p>
                  <p className="flex items-start gap-2"><FiCalendar className="mt-0.5" size={14} /> Check-in: {new Date(booking.checkIn).toLocaleString()}</p>
                  <p className="flex items-start gap-2"><FiCalendar className="mt-0.5" size={14} /> Check-out: {new Date(booking.checkOut).toLocaleString()}</p>
                </div>

                <div className="space-y-2 text-sm text-slate-700">
                  <p className="flex items-start gap-2"><FiClock className="mt-0.5" size={14} /> Created: {new Date(booking.createdAt).toLocaleString()}</p>
                  <p className="flex items-start gap-2"><FiClock className="mt-0.5" size={14} /> Updated: {new Date(booking.updatedAt).toLocaleString()}</p>
                  <p>Guests: <span className="font-semibold">{booking.numberOfGuests}</span></p>
                  <p>Room type: <span className="font-semibold">{booking.roomType || 'N/A'}</span></p>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700" style={{ borderColor: BRAND.light }}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Special requests</p>
                  <p className="mt-1">{booking.specialRequests}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {booking.status === 'pending' && (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={actionLoading === 'confirm'}
                    className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                    style={{ backgroundColor: BRAND.medium }}
                  >
                    {actionLoading === 'confirm' ? <FiLoader className="animate-spin" size={14} /> : <FiCheckCircle size={14} />}
                    Confirm Booking
                  </button>
                )}

                {booking.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={actionLoading === 'cancel'}
                    className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    {actionLoading === 'cancel' ? <FiLoader className="animate-spin" size={14} /> : <FiXCircle size={14} />}
                    Cancel Booking
                  </button>
                )}

                <button
                  type="button"
                  onClick={refreshBooking}
                  className="rounded-md border bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  style={{ borderColor: BRAND.light }}
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingDetailsPage
