import { useEffect, useState } from 'react'

const defaultState = {
  type: '',
  price: 0,
  capacity: 1,
  description: '',
  images: [],
  isAvailable: true,
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read selected image file'))
    reader.readAsDataURL(file)
  })
}

function RoomForm({
  initialValues,
  onCancel,
  onSubmit,
  formTitle = 'Room Form',
  submitLabel = 'Add Room',
}) {
  const [form, setForm] = useState(defaultState)
  const [imageError, setImageError] = useState('')

  useEffect(() => {
    if (!initialValues) {
      setForm(defaultState)
      return
    }

    setForm({
      type: initialValues.type || '',
      price: initialValues.price ?? 0,
      capacity: initialValues.capacity ?? 1,
      description: initialValues.description || '',
      images: initialValues.images || [],
      isAvailable: initialValues.isAvailable ?? true,
    })
    setImageError('')
  }, [initialValues])

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }))
      return
    }

    if (name === 'price' || name === 'capacity') {
      setForm((prev) => ({ ...prev, [name]: Number(value) }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleImagesChange(event) {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) return

    try {
      setImageError('')
      const imageDataUrls = await Promise.all(files.map(readFileAsDataUrl))
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...imageDataUrls],
      }))
    } catch (error) {
      setImageError(error.message)
    } finally {
      event.target.value = ''
    }
  }

  function handleRemoveImage(indexToRemove) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit?.(form)

    if (!initialValues) {
      setForm(defaultState)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-[#0a2342]/15 bg-gradient-to-b from-white to-[#f8fbff] p-5 shadow-lg shadow-[#0a2342]/10"
    >
      <div className="rounded-xl bg-gradient-to-r from-[#0a2342] to-[#1d4ed8] px-4 py-4 text-white">
        <h3 className="text-lg font-semibold">{formTitle}</h3>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[#0a2342]">Room Type</label>
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Room type"
          required
          className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0a2342]">Price (USD)</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              $
            </span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="w-full rounded-lg border border-[#cbd5e1] bg-white py-2.5 pl-7 pr-3 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0a2342]">Capacity</label>
          <input
            name="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[#0a2342]">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Add room description"
          className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[#0a2342]">Room Photos</label>
        <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#93c5fd] bg-[#eff6ff] px-4 py-4 text-sm font-semibold text-[#1d4ed8] hover:bg-[#dbeafe]">
          Add files or photos
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="hidden"
          />
        </label>

        {imageError && (
          <p className="mt-2 text-xs font-medium text-rose-600">{imageError}</p>
        )}

        {form.images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4">
            {form.images.map((image, index) => (
              <div key={`${image.slice(0, 24)}-${index}`} className="relative overflow-hidden rounded-lg border border-[#dbeafe] bg-white shadow-sm">
                <img src={image} alt={`Room ${index + 1}`} className="h-20 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-1 top-1 rounded bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-semibold text-white hover:bg-slate-900"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

        <label className="flex items-center gap-2 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-3 text-sm text-slate-700">
        <input
          name="isAvailable"
          type="checkbox"
          checked={form.isAvailable}
          onChange={handleChange}
        />
        Available for booking
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
            className="rounded-lg bg-[#1d4ed8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e40af]"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
              className="rounded-lg border border-[#bfdbfe] px-4 py-2.5 text-sm font-medium text-[#1d4ed8] transition hover:bg-[#eff6ff]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default RoomForm
