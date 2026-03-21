import { Link } from 'react-router-dom'
import { hotelServicePaths } from '../../utils/hotelPaths'

function Navbar() {
  return (
    <nav className="bg-[#0a2342] px-6 py-4 text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to={hotelServicePaths.home} className="text-2xl font-bold">
          StayEase
        </Link>
        <div className="flex gap-4">
          <Link to={hotelServicePaths.home} className="hover:text-[#def6f2]">Hotels</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar