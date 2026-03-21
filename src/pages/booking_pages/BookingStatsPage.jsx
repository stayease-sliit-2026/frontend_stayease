import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiAlertCircle, FiDollarSign, FiPieChart, FiRefreshCw, FiTrendingUp } from 'react-icons/fi'
import { bookingPaths } from '../../utils/bookingPaths'
import { getUserBookingStats, hasBookingToken } from '../../services/bookingApi'
import BackButton from '../../components/hotel_components/BackButton'

const BRAND = {
  dark: '#334eac',
  medium: '#7096d1',
  light: '#bad6eb',
}

function BookingStatsPage() {
  const isAuthed = hasBookingToken()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false)
      return
    }

    async function loadStats() {
      try {
        setLoading(true)
        setError('')

        const response = await getUserBookingStats()
        setStats(response?.data || [])
      } catch (err) {
        setError(err?.message || 'Unable to load stats')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [isAuthed])

  const totalBookings = useMemo(
    () => stats.reduce((sum, item) => sum + Number(item?.count || 0), 0),
    [stats],
  )

  const totalSpent = useMemo(
    () => stats.reduce((sum, item) => sum + Number(item?.totalSpent || 0), 0),
    [stats],
  )

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <BackButton fallbackPath={bookingPaths.home} label="Back to booking dashboard" />
          <div className="flex gap-2">
            <Link
              to={bookingPaths.list}
              className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              style={{ borderColor: BRAND.light }}
            >
              My Bookings
            </Link>
            <Link
              to={bookingPaths.create}
              className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              style={{ borderColor: BRAND.light }}
            >
              Create Booking
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: BRAND.light }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: BRAND.dark }}>Booking statistics</h1>
              <p className="mt-1 text-sm text-slate-600">Quick insights of status counts and spending</p>
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
              You need a valid login token to view stats.
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <FiAlertCircle className="mt-0.5" size={15} />
              {error}
            </div>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border bg-slate-50 p-4" style={{ borderColor: BRAND.light }}>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FiPieChart size={14} />
                Total bookings
              </p>
              <p className="mt-2 text-3xl font-bold" style={{ color: BRAND.dark }}>{loading ? '...' : totalBookings}</p>
            </article>

            <article className="rounded-2xl border bg-slate-50 p-4" style={{ borderColor: BRAND.light }}>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FiDollarSign size={14} />
                Lifetime spend
              </p>
              <p className="mt-2 text-3xl font-bold" style={{ color: BRAND.dark }}>{loading ? '...' : `$${totalSpent.toFixed(2)}`}</p>
            </article>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border" style={{ borderColor: BRAND.light }}>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr style={{ backgroundColor: BRAND.dark }} className="text-left text-xs font-semibold uppercase tracking-wide text-white">
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Count</th>
                    <th className="px-4 py-3">Total Spent</th>
                    <th className="px-4 py-3">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500">Loading stats...</td>
                    </tr>
                  )}

                  {!loading && stats.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500">No booking stats available.</td>
                    </tr>
                  )}

                  {!loading && stats.map((item, index) => {
                    const count = Number(item?.count || 0)
                    const share = totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0

                    return (
                      <tr key={item?._id || index} className={index % 2 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="px-4 py-3 text-sm font-semibold capitalize text-slate-700">{item?._id || 'unknown'}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{count}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">${Number(item?.totalSpent || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <div className="flex items-center gap-2">
                            <FiTrendingUp size={14} className="text-slate-500" />
                            {share}%
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookingStatsPage
