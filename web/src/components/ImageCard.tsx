import React, { useState } from 'react'
import { CrossIcon, DownloadIcon } from '../assets/Icons'

export function ImageCard({ item, onDelete }: { item: Item; onDelete: () => void }) {
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