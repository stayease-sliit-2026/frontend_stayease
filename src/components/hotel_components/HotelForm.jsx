import { useEffect, useState } from 'react'

const defaultState = {
  name: '',
  location: '',
  description: '',
  rating: 0,
  amenitiesText: '',
  images: [],
}

function readFilesAsDataUrls(files) {
  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`))
          reader.readAsDataURL(file)
        }),
    ),
  )
}

function FieldLabel({ title, hint }) {
  return (
    <div className="mb-1">
      <label className="block text-sm font-semibold text-[#0a2342]">{title}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

function HotelForm({
  initialValues,
  onCancel,
  onSubmit,
  formTitle = 'Hotel Form',
  submitLabel = 'Save Hotel',
}) {
  const [form, setForm] = useState(defaultState)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    if (!initialValues) {
      setForm(defaultState)
      return
    }

    setForm({
      name: initialValues.name || '',
      location: initialValues.location || '',
      description: initialValues.description || '',
      rating: initialValues.rating ?? 0,
      amenitiesText: (initialValues.amenities || []).join(', '),
      images: initialValues.images || [],
    })
  }, [initialValues])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }))
  }

  async function handleImageUpload(event) {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) {
      return
    }

    try {
      setUploadError('')
      const imageUrls = await readFilesAsDataUrls(files)
      setForm((prev) => ({ ...prev, images: [...prev.images, ...imageUrls] }))
      event.target.value = ''
    } catch (error) {
      setUploadError(error.message)
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

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      rating: form.rating,
      amenities: form.amenitiesText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      images: form.images,
    }

    await onSubmit?.(payload)

    if (!initialValues) {
      setForm(defaultState)
      setUploadError('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#0a2342]/15 bg-gradient-to-b from-white to-[#f8fbff] p-5 shadow-lg shadow-[#0a2342]/10"
    >
      <div className="rounded-xl bg-gradient-to-r from-[#0a2342] to-[#1d4ed8] px-4 py-4 text-white">
        <h3 className="text-lg font-semibold">{formTitle}</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel title="Hotel Name" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Hotel name"
            required
            className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
          />
        </div>

        <div>
          <FieldLabel title="Location" />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
          />
        </div>
      </div>

      <div>
        <FieldLabel title="Description" />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel title="Rating" hint="0 to 5" />
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
          />
        </div>

        <div>
          <FieldLabel title="Amenities" hint="Comma separated" />
          <input
            name="amenitiesText"
            value={form.amenitiesText}
            onChange={handleChange}
            placeholder="Pool, Wi-Fi, Parking"
            className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/15"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <FieldLabel title="Hotel Images" hint="Upload one or more" />
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#93c5fd] bg-[#eff6ff] px-4 py-6 text-center hover:bg-[#dbeafe]">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <span className="text-sm font-semibold text-[#1d4ed8]">Choose Images</span>
          </label>
          {uploadError && <p className="mt-2 text-sm text-rose-600">{uploadError}</p>}
        </div>

        {form.images.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-slate-900">Selected Images</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {form.images.map((image, index) => (
                <div key={`${image.slice(0, 20)}-${index}`} className="overflow-hidden rounded-xl border border-[#dbeafe] bg-white shadow-sm">
                  <img
                    src={image}
                    alt={`Hotel preview ${index + 1}`}
                    className="h-32 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="w-full border-t border-[#dbeafe] px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Remove Image
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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

export default HotelForm
