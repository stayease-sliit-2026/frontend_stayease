import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiLayers, FiMapPin, FiPlus, FiSearch, FiStar, FiTrash2, FiX } from 'react-icons/fi'
import { MdHotel } from 'react-icons/md'
import HotelForm from '../../components/hotel_components/HotelForm'
import useHotelService from '../../hooks/useHotelService'

function AdminPage({ embedded = false, onManageHotel } = {}) {
  const { createHotel, deleteHotel, listHotels } = useHotelService()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deletingHotelId, setDeletingHotelId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handlePageError(err) {
    const msg = err?.message || 'Request failed'
    setError(msg)
  }

  const hasFilters = useMemo(
    () => Boolean(searchName.trim() || searchLocation.trim()),
    [searchLocation, searchName],
  )

  const filteredHotels = useMemo(() => {
    const nameFilter = searchName.trim().toLowerCase()
    const locationFilter = searchLocation.trim().toLowerCase()

    return hotels.filter((hotel) => {
      const hotelName = (hotel.name || '').toLowerCase()
      const hotelLocation = (hotel.location || '').toLowerCase()

      const matchesName = !nameFilter || hotelName.includes(nameFilter)
      const matchesLocation = !locationFilter || hotelLocation.includes(locationFilter)

      return matchesName && matchesLocation
    })
  }, [hotels, searchLocation, searchName])

  async function loadHotels() {
    try {
      setLoading(true)
      setError('')
      const data = await listHotels()
      setHotels(data)
    } catch (err) {
      handlePageError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotels()
  }, [])

  async function handleCreateHotel(payload) {
    try {
      setError('')
      setMessage('')
      await createHotel(payload)
      setMessage('Hotel created successfully.')
      setShowCreateForm(false)
      await loadHotels()
    } catch (err) {
      handlePageError(err)
    }
  }

  function handleDeleteHotel(hotelId) {
    setDeletingHotelId(hotelId)
  }

  async function confirmDeleteHotel() {
    if (!deletingHotelId) return

    try {
      setError('')
      setMessage('')
      await deleteHotel(deletingHotelId)
      setDeletingHotelId('')
      setMessage('Hotel deleted.')
      await loadHotels()
    } catch (err) {
      handlePageError(err)
    }
  }

  function clearSearch() {
    setSearchName('')
    setSearchLocation('')
  }

  const shellClass = embedded
    ? 'w-full'
    : 'min-h-screen bg-sky-100/80'

  const containerClass = embedded
    ? 'w-full'
    : 'mx-auto w-full max-w-7xl px-4 py-6'

  const heroClass = embedded
    ? 'mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm'
    : 'mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-5 shadow-sm md:px-6'

  const panelClass = embedded
    ? 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
    : 'overflow-hidden rounded-2xl border border-sky-200 bg-sky-50 shadow-sm'

  if (embedded) {
    return (
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1120px] space-y-6 px-4 py-4 lg:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Hotel Management</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage hotels, update listings, and maintain your inventory.
                </p>
              </div>

              <div className="grid w-full gap-3 sm:max-w-md sm:grid-cols-2 lg:w-[320px] lg:flex-none">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Total</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">{loading ? '...' : hotels.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Visible</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">{loading ? '...' : filteredHotels.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
              <button
                type="button"
                onClick={() => setShowCreateForm((prev) => !prev)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
              >
                {showCreateForm ? <FiX size={15} /> : <FiPlus size={15} />}
                {showCreateForm ? 'Cancel' : 'New Hotel'}
              </button>

              <label className="relative min-w-0">
                <FiSearch size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(event) => setSearchName(event.target.value)}
                  placeholder="Search by hotel name"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-500 focus:border-[#2563eb] focus:outline-none"
                />
              </label>

              <label className="relative min-w-0">
                <FiMapPin size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(event) => setSearchLocation(event.target.value)}
                  placeholder="Search by location"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-500 focus:border-[#2563eb] focus:outline-none"
                />
              </label>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 lg:justify-self-end"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {message && (
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-medium text-green-700">{message}</p>
              <button type="button" onClick={() => setMessage('')}>
                <FiX size={16} className="text-green-500" />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
              <p className="text-sm font-medium text-rose-700">{error}</p>
              <button type="button" onClick={() => setError('')}>
                <FiX size={16} className="text-rose-500" />
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{loading ? '...' : filteredHotels.length}</span> of{' '}
              <span className="font-semibold text-slate-900">{loading ? '...' : hotels.length}</span> hotels
            </div>

            {loading && (
              <div className="space-y-3 p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-row-${index}`} className="h-12 animate-pulse rounded bg-slate-100" />
                ))}
              </div>
            )}

            {!loading && filteredHotels.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <MdHotel size={14} />
                          Hotel
                        </span>
                      </th>
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <FiMapPin size={13} />
                          Location
                        </span>
                      </th>
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <FiStar size={13} />
                          Rating
                        </span>
                      </th>
                      <th className="px-4 py-3">Amenities</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.map((hotel, index) => (
                      <tr
                        key={hotel._id}
                        className={`border-t border-slate-100 transition hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{hotel.name}</p>
                          <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                            {hotel.description || 'No description'}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <span className="inline-flex items-center gap-1.5">
                            <FiMapPin size={13} className="text-slate-400" />
                            {hotel.location}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 ring-1 ring-blue-100">
                            <FiStar size={12} />
                            {hotel.rating ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {hotel.amenities?.length || 0} items
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {onManageHotel ? (
                              <button
                                type="button"
                                onClick={() => onManageHotel(hotel._id)}
                                className="inline-flex items-center gap-1 rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
                              >
                                <FiEdit2 size={12} />
                                Manage
                              </button>
                            ) : (
                              <a
                                href={`/hotel-admin/hotels/${hotel._id}`}
                                className="inline-flex items-center gap-1 rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
                              >
                                <FiEdit2 size={12} />
                                Manage
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteHotel(hotel._id)}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              <FiTrash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && hotels.length === 0 && (
              <div className="p-10 text-center">
                <MdHotel size={36} className="mx-auto mb-3 text-[#9ca3af]" />
                <p className="text-sm text-slate-500">
                  No hotels yet. Click <strong>New Hotel</strong> to get started.
                </p>
              </div>
            )}

            {!loading && hotels.length > 0 && filteredHotels.length === 0 && (
              <div className="p-10 text-center">
                <FiSearch size={32} className="mx-auto mb-3 text-[#9ca3af]" />
                <p className="text-sm text-slate-500">No hotels found for this search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Create hotel modal */}
        {showCreateForm && (
          <div
            className="fixed inset-0 z-[1000] flex items-start justify-center bg-slate-900/50 p-4 pt-24 md:items-center md:pt-8"
            onClick={() => setShowCreateForm(false)}
          >
            <div
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-1 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 pt-4">
                <h3 className="text-base font-semibold text-[#0a2342]">Create New Hotel</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close create hotel form"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="p-4 pt-3">
                <HotelForm
                  onSubmit={handleCreateHotel}
                  onCancel={() => setShowCreateForm(false)}
                  formTitle="Create New Hotel"
                  submitLabel="Create Hotel"
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete hotel modal */}
        {deletingHotelId && (
          <div
            className="fixed inset-0 z-[1000] flex items-start justify-center bg-slate-900/50 p-4 pt-24 md:items-center md:pt-8"
            onClick={() => setDeletingHotelId('')}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-slate-900">Delete Hotel</h3>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to delete this hotel and all its rooms? This cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingHotelId('')}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteHotel}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                >
                  Delete Hotel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className={shellClass}>
      <div className={containerClass}>
      <div className={heroClass}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] md:text-3xl">Hotel Management</h1>
          </div>

          <div className="grid min-w-[220px] grid-cols-2 gap-2">
            <div className="rounded-xl border border-sky-200 bg-sky-100/70 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Total</p>
              <p className="mt-0.5 text-lg font-bold text-[#111827]">{loading ? '...' : hotels.length}</p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-100/70 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Visible</p>
              <p className="mt-0.5 text-lg font-bold text-[#111827]">{loading ? '...' : filteredHotels.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm md:p-5 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0a2342]">
              <FiLayers size={15} />
              Admin Filters
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex items-center gap-1 rounded-md border border-sky-300 px-3 py-1.5 text-xs font-medium text-[#0a2342] hover:bg-sky-100"
              >
                <FiX size={13} />
                Clear
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
          >
            {showCreateForm ? <FiX size={15} /> : <FiPlus size={15} />}
            {showCreateForm ? 'Cancel' : 'New Hotel'}
          </button>

          <div className="mb-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
            Hotels available: <span className="font-semibold">{loading ? '...' : hotels.length}</span>
          </div>
          <div className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
            Showing: <span className="font-semibold">{loading ? '...' : filteredHotels.length}</span>
          </div>

          <div className="space-y-3">
            <label className="relative block">
              <FiSearch size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#60a5fa]" />
              <input
                type="text"
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
                placeholder="Search by hotel name"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-500 focus:border-[#2563eb] focus:outline-none"
              />
            </label>
            <label className="relative block">
              <FiMapPin size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#60a5fa]" />
              <input
                type="text"
                value={searchLocation}
                onChange={(event) => setSearchLocation(event.target.value)}
                placeholder="Search by location"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-500 focus:border-[#2563eb] focus:outline-none"
              />
            </label>
          </div>
        </aside>

        <div>
          {message && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-medium text-green-700">{message}</p>
              <button type="button" onClick={() => setMessage('')}>
                <FiX size={16} className="text-green-500" />
              </button>
            </div>
          )}
          {error && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
              <p className="text-sm font-medium text-rose-700">{error}</p>
              <button type="button" onClick={() => setError('')}>
                <FiX size={16} className="text-rose-500" />
              </button>
            </div>
          )}

          <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            Showing <span className="font-semibold text-[#111827]">{loading ? '...' : filteredHotels.length}</span> of <span className="font-semibold text-[#111827]">{loading ? '...' : hotels.length}</span> hotels
          </div>

          <div className={panelClass}>
            {loading && (
              <div className="space-y-3 p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-row-${index}`} className="h-12 animate-pulse rounded bg-[#f3f4f6]" />
                ))}
              </div>
            )}

            {!loading && filteredHotels.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <MdHotel size={14} />
                          Hotel
                        </span>
                      </th>
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <FiMapPin size={13} />
                          Location
                        </span>
                      </th>
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <FiStar size={13} />
                          Rating
                        </span>
                      </th>
                      <th className="px-4 py-3">Amenities</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.map((hotel, index) => (
                      <tr
                        key={hotel._id}
                        className={`border-t border-slate-200 transition hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#111827]">{hotel.name}</p>
                          <p className="mt-1 max-w-sm truncate text-xs text-slate-500">{hotel.description || 'No description'}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <span className="inline-flex items-center gap-1.5">
                            <FiMapPin size={13} className="text-[#6b7280]" />
                            {hotel.location}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 ring-1 ring-blue-100">
                            <FiStar size={12} />
                            {hotel.rating ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {hotel.amenities?.length || 0} items
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {onManageHotel ? (
                              <button
                                type="button"
                                onClick={() => onManageHotel(hotel._id)}
                                className="inline-flex items-center gap-1 rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
                              >
                                <FiEdit2 size={12} />
                                Manage
                              </button>
                            ) : (
                              <a
                                href={`/hotel-admin/hotels/${hotel._id}`}
                                className="inline-flex items-center gap-1 rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
                              >
                                <FiEdit2 size={12} />
                                Manage
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteHotel(hotel._id)}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              <FiTrash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && hotels.length === 0 && (
              <div className="p-10 text-center">
                <MdHotel size={36} className="mx-auto mb-3 text-[#9ca3af]" />
                <p className="text-sm text-slate-500">
                  No hotels yet. Click <strong>New Hotel</strong> to get started.
                </p>
              </div>
            )}

            {!loading && hotels.length > 0 && filteredHotels.length === 0 && (
              <div className="p-10 text-center">
                <FiSearch size={32} className="mx-auto mb-3 text-[#9ca3af]" />
                <p className="text-sm text-slate-500">
                  No hotels found for this search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Create hotel modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center bg-slate-900/50 p-4 pt-24 md:items-center md:pt-8"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-1 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4">
              <h3 className="text-base font-semibold text-[#0a2342]">Create New Hotel</h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close create hotel form"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-4 pt-3">
              <HotelForm
                onSubmit={handleCreateHotel}
                onCancel={() => setShowCreateForm(false)}
                formTitle="Create New Hotel"
                submitLabel="Create Hotel"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete hotel modal */}
      {deletingHotelId && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center bg-slate-900/50 p-4 pt-24 md:items-center md:pt-8"
          onClick={() => setDeletingHotelId('')}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">Delete Hotel</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this hotel and all its rooms? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingHotelId('')}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteHotel}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                Delete Hotel
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

export default AdminPage
