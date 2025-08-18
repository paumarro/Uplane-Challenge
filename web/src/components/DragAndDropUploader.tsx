import React, { useState } from 'react';
import backgroundImage from '../assets/uplane-gradient.jpg';

type Props = {
  onFiles: (files: FileList | null) => void;
  uploading: boolean;
};

export default function DragAndDropUploader({ onFiles, uploading }: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    onFiles(e.dataTransfer.files);
  };

  return (
    <div
      className="rounded-3xl mt-12 sm:mt-16 md:mt-20 mb-6 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Fixed-size inner container to prevent layout shift */}
      <div className="h-[457px] px-8 sm:px-16 md:px-24 py-16 text-center transition-colors">
        {dragOver ? (
          // Center "Drop Here" without changing container size
          <div className="h-full flex items-center justify-center">
            <p className="text-3xl font-bold text-blue-600">Drop Here</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl sm:text-5xl text-[44.5px] font-bold tracking-tight mb-3 mt-10 text-black">
              Background Remover
            </h1>
            <p className="text-gray-700 text-[23px] leading-8 mb-8 font-thin">
              Remove background from image instantly, <br />
              fully automated and
              <span className="font-bold bg-gradient-to-b from-[#155DFC] to-[#022C89] bg-clip-text text-transparent font-semibold">
                {' '}
                free
              </span>
            </p>
            <label className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              Upload image
            </label>
            <p className="m-4 text-[12px] text-black">or Drop an Image here</p>
            {uploading && <p className="mt-3 text-sm text-gray-500">Processing...</p>}
          </>
        )}
      </div>
    </div>
  );
}
