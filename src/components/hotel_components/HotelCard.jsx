import { Link } from 'react-router-dom'
import { FiEye, FiMapPin, FiSettings, FiStar, FiTrash2 } from 'react-icons/fi'
import { hotelServicePaths } from '../../utils/hotelPaths'

function HotelCard({ hotel, isAdmin = false, onDelete }) {
  const primaryImage = hotel.images?.[0]
  const cardClassName = isAdmin
    ? 'overflow-hidden rounded-xl border border-[#374151] bg-gradient-to-r from-[#111827] to-[#1f2937] text-slate-100 shadow-md transition hover:shadow-xl hover:shadow-[#111827]/30 md:flex'
    : 'overflow-hidden rounded-xl border border-[#0a2342]/10 bg-white shadow-sm transition hover:shadow-lg hover:shadow-[#0a2342]/10 md:flex'

  const imageWrapClassName = isAdmin
    ? 'h-28 bg-[#111827] md:h-auto md:w-52 md:shrink-0'
    : 'h-28 bg-[#0a2342]/5 md:h-auto md:w-52 md:shrink-0'

  return (
    <article className={cardClassName}>
      <div className={imageWrapClassName}>
        {primaryImage ? (
          <img src={primaryImage} alt={hotel.name} className="h-full w-full object-cover" />
        ) : (
          <div className={`flex h-full items-center justify-center text-sm font-medium ${isAdmin ? 'bg-gradient-to-br from-[#111827] to-[#374151] text-slate-300' : 'bg-gradient-to-br from-[#0a2342] to-[#27476b] text-[#def6f2]'}`}>
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 md:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {isAdmin && (
              <span className="mb-1 inline-flex rounded-full bg-[#f59e0b]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#fbbf24]">
                Admin View
              </span>
            )}
            <h2 className={`truncate text-base font-semibold md:text-lg ${isAdmin ? 'text-white' : 'text-slate-800'}`}>{hotel.name}</h2>

            <p className={`mt-1 flex items-center gap-1 text-xs md:text-sm ${isAdmin ? 'text-slate-300' : 'text-slate-500'}`}>
              <FiMapPin size={12} />
              <span className="truncate">{hotel.location}</span>
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs md:text-sm">
              <FiStar size={12} className="text-amber-400" />
              <span className={`font-medium ${isAdmin ? 'text-slate-100' : 'text-slate-700'}`}>{hotel.rating ?? 0}</span>
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-1.5 sm:justify-end">
            {isAdmin ? (
              <>
                <Link
                  to={hotelServicePaths.adminHotelDetails(hotel._id)}
                  className="flex items-center gap-1 rounded-md bg-[#f59e0b] px-2.5 py-1 text-xs font-semibold text-[#111827] hover:bg-[#d97706]"
                >
                  <FiSettings size={12} />
                  Manage
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete?.(hotel._id)}
                  className="flex items-center gap-1 rounded-md border border-rose-300/50 px-2.5 py-1 text-xs font-medium text-rose-200 hover:bg-rose-500/10"
                >
                  <FiTrash2 size={12} />
                  Delete
                </button>
              </>
            ) : (
              <Link
                to={hotelServicePaths.hotelDetails(hotel._id)}
                className="flex items-center gap-1.5 rounded-md bg-[#0a2342] px-3.5 py-1.5 text-sm font-semibold !text-white visited:!text-white hover:bg-[#1e3a5c] hover:!text-white"
              >
                <FiEye size={14} />
                View Details
              </Link>
            )}
          </div>
        </div>

        <p className={`mt-2 line-clamp-2 text-xs md:text-sm ${isAdmin ? 'text-slate-300' : 'text-slate-500'}`}>
          {hotel.description || 'No description yet.'}
        </p>

        {hotel.amenities?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isAdmin ? 'bg-[#374151] text-slate-100' : 'bg-[#eaf7f5] text-[#1e3a5c]'}`}
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${isAdmin ? 'bg-[#4b5563] text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default HotelCard