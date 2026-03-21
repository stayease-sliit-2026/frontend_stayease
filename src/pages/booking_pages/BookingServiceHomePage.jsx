import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiActivity, FiAlertCircle, FiCheckCircle, FiClock, FiGrid, FiRefreshCw, FiServer } from 'react-icons/fi'
import { bookingPaths } from '../../utils/bookingPaths'
import { getBookingHealth, getBookingServiceInfo, getUserBookingStats, hasBookingToken } from '../../services/bookingApi'

const BRAND = {
  dark: '#334eac',
  medium: '#7096d1',
  light: '#bad6eb',
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

function BookingServiceHomePage() {
  const [serviceInfo, setServiceInfo] = useState(null)
  const [health, setHealth] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isAuthed = hasBookingToken()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError('')

        const [infoData, healthData, statsData] = await Promise.all([
          getBookingServiceInfo(),
          getBookingHealth(),
          isAuthed ? getUserBookingStats() : Promise.resolve(null),
        ])

        setServiceInfo(infoData)
        setHealth(healthData)
        setStats(statsData?.data || [])
      } catch (err) {
        setError(err?.message || 'Unable to load booking overview')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthed])

  const statCards = useMemo(() => getStatCards(stats), [stats])

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div
          className="overflow-hidden rounded-3xl border shadow-lg"
          style={{ borderColor: BRAND.light, background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.medium} 100%)` }}
        >
          <div className="grid gap-5 px-6 py-8 text-white md:grid-cols-[1.3fr_minmax(0,1fr)] md:px-8">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <FiGrid size={14} />
                Booking Service
              </div>
              <h1 className="text-2xl font-bold md:text-3xl">Manage bookings without leaving the hotel flow</h1>
              <p className="mt-2 max-w-xl text-sm text-white/90 md:text-base">
                Create bookings, track statuses, confirm reservations and monitor spending from one clean dashboard.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={bookingPaths.create}
                  className="rounded-md border border-white/30 bg-white px-4 py-2 text-sm font-semibold"
                  style={{ color: BRAND.dark }}
                >
                  Create Booking
                </Link>
                <Link
                  to={bookingPaths.list}
                  className="rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  My Bookings
                </Link>
                <Link
                  to={bookingPaths.stats}
                  className="rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Booking Stats
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Service health</p>
              {loading ? (
                <p className="mt-3 text-sm text-white/90">Checking booking service status...</p>
              ) : error ? (
                <p className="mt-3 flex items-start gap-2 text-sm text-rose-100">
                  <FiAlertCircle className="mt-0.5" size={15} />
                  {error}
                </p>
              ) : (
                <div className="mt-3 space-y-2 text-sm text-white/95">
                  <p className="flex items-center gap-2">
                    <FiServer size={14} />
                    {serviceInfo?.message || 'Booking service'}
                  </p>
                  <p className="flex items-center gap-2">
                    {health?.status === 'OK' ? <FiCheckCircle size={14} /> : <FiActivity size={14} />}
                    {health?.status || 'Unknown'}
                  </p>
                  <p className="flex items-center gap-2 text-white/85">
                    <FiClock size={14} />
                    {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'No timestamp'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
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

        {!isAuthed && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Stats and booking actions require login. Please login before creating, confirming, or cancelling bookings.
          </div>
        )}

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          style={{ borderColor: BRAND.light }}
        >
          <FiRefreshCw size={14} />
          Refresh data
        </button>
      </div>
    </section>
  )
}

export default BookingServiceHomePage
