import { useEffect, useMemo, useState } from 'react'
import { FiMapPin, FiSearch, FiSliders, FiStar, FiX } from 'react-icons/fi'
import HotelCard from '../../components/hotel_components/HotelCard'
import useHotelService from '../../hooks/useHotelService'

function HomePage() {
  const { listHotels } = useHotelService()
  const [hotels, setHotels] = useState([])
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [minRating, setMinRating] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const hasFilters = useMemo(
    () => Boolean(query.trim() || location.trim() || minRating),
    [location, minRating, query],
  )

  function getUserFriendlyError(message) {
    if (!message) return 'Something went wrong while loading hotels.'

    const text = message.toLowerCase()
    if (text.includes('network') || text.includes('failed to fetch') || text.includes('unable to connect')) {
      return 'We could not connect to the hotel service right now. Please try again in a moment.'
    }

    return message
  }

  useEffect(() => {
    async function loadHotels() {
      try {
        setLoading(true)
        setError('')

        const data = await listHotels({
          q: query || undefined,
          location: location || undefined,
          minRating: minRating || undefined,
        })

        setHotels(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadHotels()
  }, [query, location, minRating])

  function clearFilters() {
    setQuery('')
    setLocation('')
    setMinRating('')
  }

  return (
    <section className="min-h-screen bg-sky-100/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-lg shadow-sky-200/70 md:p-5 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0a2342]">
              <FiSliders size={16} />
              Filter Hotels
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-md border border-[#9fded6] px-3 py-1.5 text-xs font-medium text-[#1e3a5c] hover:bg-[#eaf7f5]"
              >
                <FiX size={13} />
                Clear
              </button>
            )}
          </div>

          <div className="mb-4 rounded-xl bg-sky-100 px-3 py-2 text-sm text-[#0a2342]">
            Hotels available: <span className="font-semibold">{loading ? '...' : hotels.length}</span>
          </div>

          <div className="space-y-3">
            <label className="relative block">
              <FiSearch size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4fd1c5]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hotel name"
                className="w-full rounded-lg border border-[#9fded6] py-2.5 pl-9 pr-3 text-sm focus:border-[#1e3a5c] focus:outline-none"
              />
            </label>

            <label className="relative block">
              <FiMapPin size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4fd1c5]" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full rounded-lg border border-[#9fded6] py-2.5 pl-9 pr-3 text-sm focus:border-[#1e3a5c] focus:outline-none"
              />
            </label>

            <label className="relative block">
              <FiStar size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4fd1c5]" />
              <input
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Minimum rating"
                className="w-full rounded-lg border border-[#9fded6] py-2.5 pl-9 pr-3 text-sm focus:border-[#1e3a5c] focus:outline-none"
              />
            </label>
          </div>
        </aside>

        <div>
          <div className="mb-4 text-sm text-slate-600">
            Showing <span className="font-semibold text-[#0a2342]">{loading ? '...' : hotels.length}</span> hotel{hotels.length === 1 ? '' : 's'}
          </div>

          {loading && (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-sky-200 bg-sky-50"
                >
                  <div className="h-44 bg-sky-200" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-2/3 rounded bg-sky-200" />
                    <div className="h-3 w-1/2 rounded bg-sky-200" />
                    <div className="h-3 w-full rounded bg-sky-200" />
                    <div className="h-3 w-4/5 rounded bg-sky-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <p>{getUserFriendlyError(error)}</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium hover:bg-rose-100"
              >
                Reset filters
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-4">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}

              {hotels.length === 0 && (
                <div className="rounded-2xl border border-dashed border-sky-300 bg-sky-100/70 p-10 text-center">
                  <FiSearch size={32} className="mx-auto mb-3 text-[#8cded4]" />
                  <p className="text-sm text-slate-600">No hotels match your filters yet.</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-3 rounded-md border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-medium text-[#0a2342] hover:bg-sky-100"
                  >
                    Show all hotels
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  )
}

export default HomePage
