import { useEffect, useRef, useState } from 'react'
import { uploadImage, listImages, deleteImage } from './api'

type Item = {
  id: string
  status: 'QUEUED'|'PROCESSING'|'DONE'|'ERROR'
  processedUrl?: string|null
  createdAt?: string
}

function UploadHero({
  onFiles,
  uploading,
}: {
  onFiles: (files: FileList | null) => void
  uploading: boolean
}) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <section className="mt-6">
      <div className="rounded-3xl overflow-hidden p-6 sm:p-10 md:p-16 bg-gradient-to-br from-blue-100 via-white to-indigo-300 border border-black/5">
        {/* Placeholder header inside hero */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-xl font-semibold text-gray-800">Background Remover</div>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500">Remove Background</span>
            <span className="text-sm text-gray-500">Editing Services</span>
            <span className="text-sm text-gray-500">Tools & API</span>
            <span className="text-sm text-gray-500">Pricing</span>
          </div>
        </div>

        {/* Big upload box */}
        <div
          className={`relative border-2 border-dashed rounded-2xl px-6 py-14 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white/40'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files) }}
        >
          {/* Placeholder background image overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1600&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.25,
            }}
          />
          <div className="relative">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
              Background Remover
            </h1>
            <p className="text-gray-700 mb-8">
              Removes background from image instantly, fully automated and
              <span className="text-blue-600 font-semibold"> free</span>
            </p>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow"
              >
                <UploadIcon className="h-5 w-5" />
                Upload Image
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              <span className="text-sm text-gray-600">Or Drop an Image here</span>
              {uploading && (
                <p className="mt-3 text-sm text-gray-500">Processing...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function YourImagesRow({
  items,
  onAddFiles,
  onDelete,
}: {
  items: Item[]
  onAddFiles: (files: FileList | null) => void
  onDelete: (id: string) => void
}) {
  const addInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Images</h2>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {/* Add new card */}
        <button
          className="relative shrink-0 w-48 h-48 rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors"
          onClick={() => addInputRef.current?.click()}
        >
          <span className="text-5xl leading-none">+</span>
          <input
            ref={addInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onAddFiles(e.target.files)}
          />
        </button>

        {/* Carousel of images */}
        {items.map((it) => (
          <ImageCard key={it.id} item={it} onDelete={() => onDelete(it.id)} />
        ))}
      </div>
    </section>
  )
}

function ImageCard({ item, onDelete }: { item: Item; onDelete: () => void }) {
  const [hover, setHover] = useState(false)
  const isReady = !!item.processedUrl && item.status === 'DONE'

  return (
    <div
      className="relative shrink-0 w-48 h-48 rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Delete button (top-right) */}
      <button
        onClick={onDelete}
        title="Delete image"
        className="absolute right-2 top-2 z-10 h-7 w-7 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black transition"
      >
        <CrossIcon className="h-4 w-4" />
      </button>

      {/* Image or placeholder */}
      {isReady ? (
        <img
          src={item.processedUrl!}
          alt="Processed"
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          {item.status === 'ERROR' ? 'Error' : 'Processing...'}
        </div>
      )}

      {/* Hover download overlay */}
      {hover && isReady && (
        <a
          href={item.processedUrl!}
          download
          className="absolute inset-0 bg-black/30 flex items-center justify-center"
          title="Download"
        >
          <DownloadIcon className="h-10 w-10 text-white" />
        </a>
      )}
    </div>
  )
}

export default function App() {
  const [items, setItems] = useState<Item[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    try {
      const data = await listImages()
      setItems(data)
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => { refresh() }, [])

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return
    setError(null)
    setUploading(true)
    try {
      await uploadImage(files[0])
      await refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id)
      await refresh()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900">
      {/* Top nav placeholder */}
      <header className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-blue-600" />
            <span className="font-semibold">uplane</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <span>Remove Background</span>
            <span>Editing Services</span>
            <span>Tools & API</span>
            <span>Pricing</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm rounded border border-black/10 bg-white hover:bg-gray-50">Log in</button>
            <button className="px-3 py-1.5 text-sm rounded bg-black text-white hover:bg-gray-800">Sign up</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

        <UploadHero onFiles={handleFiles} uploading={uploading} />

        <YourImagesRow items={items} onAddFiles={handleFiles} onDelete={handleDelete} />
      </main>
    </div>
  )
}

/* Icons */
function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
function CrossIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
