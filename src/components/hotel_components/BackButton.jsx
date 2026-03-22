import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { hotelServicePaths } from '../../utils/hotelPaths'

function BackButton({ fallbackPath = hotelServicePaths.home, label = 'Back to Hotels' }) {
  const navigate = useNavigate()

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(fallbackPath)
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#9fded6] bg-white text-[#0a2342] hover:bg-[#eaf7f5]"
    >
      <FiArrowLeft size={16} />
    </button>
  )
}

export default BackButton
