import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiAlertCircle, FiCheckCircle, FiEye, FiLoader, FiRefreshCw, FiXCircle } from 'react-icons/fi'
import { bookingPaths } from '../../utils/bookingPaths'
import { cancelBooking, confirmBooking, getUserBookings, getUserBookingStats, hasBookingToken } from '../../services/bookingApi'

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

function getStatCards(stats = []) {
  const map = stats.reduce((acc, item) => {
    acc[item?._id] = item
    return acc
  }, {})

  return [
    {
      key: 'confirmed',
      label: 'Confirmed',
      count: map.confirmed?.count || 0,
      totalSpent: map.confirmed?.totalSpent || 0,
      tone: 'text-emerald-700',
    },
    {
      key: 'pending',
      label: 'Pending',
      count: map.pending?.count || 0,
      totalSpent: map.pending?.totalSpent || 0,
      tone: 'text-amber-700',
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      count: map.cancelled?.count || 0,
      totalSpent: map.cancelled?.totalSpent || 0,
      tone: 'text-rose-700',
    },
  ]
}

function UserBookingsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isAuthed = hasBookingToken()

  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState([])
  const [pagination, setPagination] = useState({ total: 0, limit: 10, skip: 0, hasMore: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState('')

  const status = searchParams.get('status') || ''
  const hotelId = searchParams.get('hotelId') || ''
  const limit = Number(searchParams.get('limit') || 10)
  const skip = Number(searchParams.get('skip') || 0)

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false)
      return
    }

    async function loadData() {
      try {
        setLoading(true)
        setError('')

        const [bookingsResponse, statsData] = await Promise.all([
          getUserBookings({
            status: status || undefined,
            hotelId: hotelId || undefined,
            limit,
            skip,
          }),
          getUserBookingStats(),
        ])

        setBookings(bookingsResponse?.data || [])
        setPagination(bookingsResponse?.pagination || { total: 0, limit, skip, hasMore: false })
        setStats(statsData?.data || [])
      } catch (err) {
        setError(err?.message || 'Unable to fetch bookings')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [hotelId, isAuthed, limit, skip, status])

  function updateFilters(next) {
    const params = new URLSearchParams(searchParams)

    Object.entries(next).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    setSearchParams(params)
  }

  async function handleConfirm(bookingId) {
    try {
      setActionLoadingId(bookingId)
      // Redirect to details page where payment service integration happens
      navigate(bookingPaths.details(bookingId))
    } catch (err) {
      setError(err?.message || 'Unable to navigate to booking')
    } finally {
      setActionLoadingId('')
    }
  }

  async function handleCancel(bookingId) {
    const reason = window.prompt('Optional: cancellation reason') || ''

    try {
      setActionLoadingId(bookingId)
      
      // Step 1: Cancel the booking
      await cancelBooking(bookingId, reason)
      
      // Step 2: Mark room as available again in hotel service
      // await markRoomAvailable(hotelId, roomId, { checkIn, checkOut, bookingId })
      
      // Refresh the booking list
      console.log(fullurl)
      const response = await getUserBookings({
        status: status || undefined,
        hotelId: hotelId || undefined,
        limit,
        skip,
      })
      setBookings(response?.data || [])
      setPagination(response?.pagination || { total: 0, limit, skip, hasMore: false })
    } catch (err) {
      setError(err?.message || 'Unable to cancel booking')
    } finally {
      setActionLoadingId('')
    }
  }

  const statCards = useMemo(() => getStatCards(stats), [stats])

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BRAND.dark }}>My Bookings</h1>
            <p className="mt-1 text-sm text-slate-600">View and manage all your reservations</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={bookingPaths.create}
              className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              style={{ borderColor: BRAND.light }}
            >
              New Booking
            </Link>
            <Link
              to={bookingPaths.stats}
              className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              style={{ borderColor: BRAND.light }}
            >
              Stats
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {statCards.map((item) => (
            <article
              key={item.key}
              className="rounded-2xl border bg-white p-4 shadow-sm"
              style={{ borderColor: BRAND.light }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className={`mt-2 text-2xl font-bold ${item.tone}`}>{item.count}</p>
              <p className="mt-1 text-sm text-slate-600">Total spent: ${Number(item.totalSpent).toFixed(2)}</p>
            </article>
          ))}
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: BRAND.light }}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: BRAND.dark }}>Booking Records</h2>
              <p className="mt-1 text-sm text-slate-600">Filter and manage your bookings</p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              style={{ borderColor: BRAND.light }}
            >
              <FiRefreshCw size={14} />
              Refresh
            </button>
          </div>

          {!isAuthed && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              You need a valid login token to view bookings.
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <FiAlertCircle className="mt-0.5" size={15} />
              {error}
            </div>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Status</span>
              <select
                value={status}
                onChange={(event) => updateFilters({ status: event.target.value, skip: 0 })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: BRAND.light }}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>

            <label className="text-sm md:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">Hotel ID</span>
              <input
                value={hotelId}
                onChange={(event) => updateFilters({ hotelId: event.target.value, skip: 0 })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: BRAND.light }}
                placeholder="hotel123"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Limit</span>
              <select
                value={limit}
                onChange={(event) => updateFilters({ limit: Number(event.target.value), skip: 0 })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: BRAND.light }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border" style={{ borderColor: BRAND.light }}>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr style={{ backgroundColor: BRAND.dark }} className="text-left text-xs font-semibold uppercase tracking-wide text-white">
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Stay</th>
                    <th className="px-4 py-3">Guests</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">Loading bookings...</td>
                    </tr>
                  )}

                  {!loading && bookings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">No bookings found for these filters.</td>
                    </tr>
                  )}

                  {!loading && bookings.map((booking, index) => (
                    <tr key={booking._id} className={index % 2 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">{booking._id}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">Hotel: {booking.hotelId} | Room: {booking.roomId}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{booking.numberOfGuests}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">${Number(booking.totalPrice || 0).toFixed(2)}</td>
                      <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link
                            to={bookingPaths.details(booking._id)}
                            className="inline-flex items-center gap-1 rounded-md border bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            style={{ borderColor: BRAND.light }}
                          >
                            <FiEye size={13} />
                            View
                          </Link>

                          {booking.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleConfirm(booking._id)}
                              disabled={actionLoadingId === booking._id}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-70"
                              style={{ backgroundColor: BRAND.medium }}
                            >
                              {actionLoadingId === booking._id ? <FiLoader className="animate-spin" size={12} /> : <FiCheckCircle size={12} />}
                              Confirm
                            </button>
                          )}

                          {booking.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleCancel(booking._id)}
                              disabled={actionLoadingId === booking._id}
                              className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-70"
                            >
                              {actionLoadingId === booking._id ? <FiLoader className="animate-spin" size={12} /> : <FiXCircle size={12} />}
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <p>
              Showing {bookings.length} of {pagination.total || 0}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateFilters({ skip: Math.max(skip - limit, 0) })}
                disabled={skip <= 0}
                className="rounded-md border bg-white px-3 py-1.5 font-medium disabled:opacity-50"
                style={{ borderColor: BRAND.light }}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => updateFilters({ skip: skip + limit })}
                disabled={!pagination.hasMore}
                className="rounded-md border bg-white px-3 py-1.5 font-medium disabled:opacity-50"
                style={{ borderColor: BRAND.light }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserBookingsPage
