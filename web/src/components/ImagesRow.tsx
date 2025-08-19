import React, { useRef } from 'react';
import { ImageCard } from './ImageCard';
import { LeftIcon, RightIcon } from '../assets/Icons';

export function YourImagesRow({
  items,
  onDelete,
}: {
  items: Item[];
  onDelete: (id: string) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // Adjust scroll distance as needed
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Adjust scroll distance as needed
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mt-12">
      {items.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">Your Images</h2>

          <div className="flex space-x-2">
            <button
              className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-md"
              onClick={scrollLeft}
              aria-label="Scroll Left"
            >
              <LeftIcon className="h-5 w-5 text-gray-600" />

            </button>
            <button
              className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-md"
              onClick={scrollRight}
              aria-label="Scroll Right"
            >
              <RightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Scrollable container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-2"
        >
          {items.map((it) => (
            <ImageCard key={it.id} item={it} onDelete={() => onDelete(it.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
